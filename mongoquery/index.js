const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/prod", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

const Sales = mongoose.model("Sale", {}, "sales");

function getFormattedDate(date) {
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  return formattedDate;
}

function createDateFromMonth(month, year) {
  // Create a new Date object
  const dateObject = new Date();

  // Set the year and month
  dateObject.setFullYear(year);
  dateObject.setMonth(month - 1); // Subtract 1 since months are zero-based

  // Set the date to the 1st day of the month
  dateObject.setDate(1);

  return dateObject;
}

app.get("/getDocuments", async (req, res) => {
  //   const { referenceMonth, year } = req.body;
  console.log(req.query);
  const referenceStart = getFormattedDate(
    createDateFromMonth(req.query?.month, req.query?.year)
  );

  const referenceEnd = getFormattedDate(
    createDateFromMonth(Number(req.query?.month) + 1, req.query?.year)
  );

  console.log(referenceStart, referenceEnd);

  try {
    // Retrieve all documents from the collection
    const documents = await Sales.aggregate([
      // Match documents for the specified reference month
      {
        $match: {
          saleDay: {
            $gte: referenceStart,
            $lt: referenceEnd, // Start of current month
          },
          status: "Closed",
        },
      },
      // Group by branchCode and calculate reference month sales and orders
      {
        $group: {
          _id: "$branchCode",
          referenceMonthSales: { $sum: "$netAmount" },
          referenceMonthOrders: { $sum: 1 },
        },
      },
      // Lookup the current month data
      {
        $lookup: {
          from: "sales", // Replace with the actual collection name
          let: { branch_code: "$_id" },
          pipeline: [
            {
              $match: {
                saleDay: {
                  $gte: getFormattedDate(new Date(new Date().setDate(1))), // Start of current month
                  $lt: getFormattedDate(new Date()), // Given date
                },
                status: "Closed",
                $expr: { $eq: ["$branchCode", "$$branch_code"] },
              },
            },
            { $project: { _id: 0, netAmount: 1 } },
          ],
          as: "currentMonthData",
        },
      },
      // Calculate current month sales and orders
      {
        $addFields: {
          currentMonthSales: { $sum: "$currentMonthData.netAmount" },
          currentMonthOrders: { $size: "$currentMonthData" },
        },
      },
      // Calculate other metrics
      {
        $addFields: {
          mtdGrowthPercentage: {
            $cond: {
              if: { $eq: ["$referenceMonthSales", 0] },
              then: 0,
              else: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$currentMonthSales",
                          "$referenceMonthSales",
                        ],
                      },
                      "$referenceMonthSales",
                    ],
                  },
                  100,
                ],
              },
            },
          },
          normalisedSales: {
            $divide: [
              { $multiply: ["$currentMonthSales", 30] }, // Sales for 8 days normalized to 30 days
              8,
            ],
          },
          referenceMonthSale: "$referenceMonthSales",
          growthPercentageNormalizedVsReference: {
            $cond: {
              if: { $eq: ["$referenceMonthSales", 0] },
              then: 0,
              else: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: ["$normalisedSales", "$referenceMonthSales"],
                      },
                      "$referenceMonthSales",
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
      // Project and reshape the output
      {
        $project: {
          _id: 0,
          branchCode: "$_id",
          referenceMonthSales: 1,
          referenceMonthOrders: 1,
          currentMonthSales: 1,
          currentMonthOrders: 1,
          mtdGrowthPercentage: 1,
          normalisedSales: 1,
          referenceMonthSale: 1,
          growthPercentageNormalizedVsReference: 1,
        },
      },
      { $limit: 50 },
    ]);

    res.json(documents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import React, { useState, useEffect } from "react";
import { getAttendance } from "../api";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const StudentDashboard = ({ loggedIn, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [activeTab, setActiveTab] = useState("profile");
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendanceData();
    }
  }, [activeTab, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      const attendance = await getAttendance(currentUser?._id, selectedDate);
      setAttendanceData(attendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    if (!loggedIn && localStorage.getItem("user") === null) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <div className="container mx-auto mt-8">
      <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 border-y-[1px] border-[#d6d6d6] mb-[54px]">
        <li
          className={`cursor-pointer p-[8px] ${
            activeTab === "profile" ? "font-bold bg-[#d6d6d6]" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </li>
        <li
          className={`cursor-pointer p-[8px] ${
            activeTab === "attendance" ? "font-bold bg-[#d6d6d6]" : ""
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </li>
      </ul>
      <div className="grid grid-cols-1 md:gap-4 px-[24px] md:px-0">
        {activeTab === "profile" && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            {/* Replace with your profile UI */}
            <p>Name: {currentUser?.name}</p>
            <p>Age: {currentUser?.age}</p>
            <p>Class: {currentUser?.class}</p>
            <p>Subjects: {currentUser?.subjects?.join(", ")}</p>
          </div>
        )}
        {activeTab === "attendance" && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Attendance</h2>
            <div className="flex flex-col mb-[24px]">
              <label>Date:</label>
              <DatePicker
                className="border p-2 rounded"
                maxDate={new Date()}
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
              />
            </div>
            {attendanceData.length === 0 ? (
              <p>No attendance records available.</p>
            ) : (
              <ul>
                {attendanceData.map((record) => (
                  <li key={record._id} className="mb-2">
                    {/* <p>Date: {new Date(record.date).toLocaleDateString()}</p> */}
                    <p>Attended: {record.subjects.join(", ")}</p>
                    <p>
                      Absent:{" "}
                      {currentUser?.subjects
                        ?.filter((sub) => !record.subjects?.includes(sub))
                        ?.join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

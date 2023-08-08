import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAttendance, markAttendance, updateAttendance } from "../api";

const AttendanceRow = ({ student, index, date }) => {
  const [selected, setSelected] = useState([]);
  const [previousRecord, setPreviosRecord] = useState();

  useEffect(() => {
    console.log(date);
    const getAttendanceFunc = async () => {
      const response = await getAttendance(student._id, date);
      if (response.length > 0) {
        setPreviosRecord(response[0]);
        setSelected(response[0].subjects?.map((e) => ({ label: e, value: e })));
      } else {
        setPreviosRecord();
        setSelected([]);
      }
    };
    getAttendanceFunc();
  }, [student, date]);

  const handleSubmit = async () => {
    if (previousRecord) {
      const response = await updateAttendance({
        attendanceId: previousRecord._id,
        subjects: selected.map((e) => e.value),
      });
    } else {
      const response = await markAttendance({
        date,
        studentId: student._id,
        subjects: selected.map((e) => e.value),
      });
    }

    alert("Attendance Updated Successfully");
  };

  return (
    <tr
      key={student.id}
      className={`${
        index % 2 === 0 ? "bg-gray-100" : "bg-white"
      } hover:bg-gray-200 transition-colors`}
    >
      <td className="px-4 py-2">{student.name}</td>
      <td className="px-4 py-2">
        <Select
          isMulti
          value={selected}
          options={student.subjects?.map((e) => ({ label: e, value: e }))}
          onChange={(selectedOptions) => {
            setSelected(selectedOptions);
          }}
          className="w-full"
        ></Select>
      </td>
      <td className="px-4 py-2">
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto hover:bg-blue-600"
        >
          Submit
        </button>
      </td>
    </tr>
  );
};

export default AttendanceRow;

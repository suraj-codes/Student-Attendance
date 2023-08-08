import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { getStudents } from "../api";
import AttendanceRow from "./AttendanceRow";

const AttendanceForm = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Simulated class options
  const [classOptions, setClassOptions] = useState([]);

  // Simulated student data
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Simulated subject options
  const subjectOptions = ["Math", "Science", "History", "English"];

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    // Handle attendance submission
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await getStudents();
      setStudents(response.reverse());
      setFilteredStudents(response);

      const uniqueNames = [...new Set(response.map((obj) => obj.class))];
      setClassOptions(uniqueNames);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedClass === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((std) => std.class === selectedClass)
      );
    }
  }, [selectedClass]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center md:text-left">
        Student Attendance
      </h2>
      <form
        onSubmit={handleAttendanceSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-center"
      >
        {/* Date input */}
        <div className="flex flex-col">
          <label htmlFor="date">Date:</label>
          <DatePicker
            id="date"
            className="border p-2 rounded"
            maxDate={new Date()}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
          />
        </div>

        {/* Class select */}
        <div className="flex flex-col">
          <label htmlFor="class">Class:</label>
          <select
            id="class"
            className="border p-2 rounded bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div className="shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left w-full md:w-[40%]">
                Attended
              </th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <AttendanceRow
                student={student}
                index={index}
                date={selectedDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceForm;

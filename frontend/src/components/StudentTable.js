import React, { useEffect, useState } from "react";
import { getStudents } from "../api";

const StudentTable = ({ setIsAddStudentModalOpen, students }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-[1px] border-[#d3d3d3]">
      {/* <h2 className="text-xl font-semibold mb-4">Student Database</h2> */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsAddStudentModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Student
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Class</th>
              <th className="px-4 py-2 text-left">Subjects</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.age}</td>
                <td className="px-4 py-2">{student.class}</td>
                <td className="px-4 py-2">{student.subjects.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;

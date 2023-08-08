import React, { useEffect, useState } from "react";
import StudentTable from "./StudentTable";
import AttendanceForm from "./AttendanceForm";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../api";
import AddStudentModal from "./AddStudentModal";

const AdminDashboard = ({ loggedIn }) => {
  const [activeTab, setActiveTab] = useState("database");
  const [students, setStudents] = useState([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddStudent = (data) => {
    setStudents((prevState) => [data, ...prevState]);
  };

  useEffect(() => {
    if (!loggedIn && localStorage.getItem("user") === null) {
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await getStudents();
      setStudents(response.reverse());
    };
    fetchStudents();
  }, [activeTab]);

  return (
    <div className="container mx-auto mt-8">
      <ul className="flex space-x-4 border-y-[1px] border-[#d6d6d6] mb-[54px]">
        <li
          className={`cursor-pointer p-[8px] ${
            activeTab === "database" ? "font-bold bg-[#d6d6d6]" : ""
          }`}
          onClick={() => setActiveTab("database")}
        >
          Student Database
        </li>
        <li
          className={`cursor-pointer p-[8px] ${
            activeTab === "attendance" ? "font-bold bg-[#d6d6d6]" : ""
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          Student Attendance
        </li>
      </ul>
      {activeTab === "database" && (
        <StudentTable
          students={students}
          setIsAddStudentModalOpen={setIsAddStudentModalOpen}
        />
      )}
      {activeTab === "attendance" && <AttendanceForm />}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default AdminDashboard;

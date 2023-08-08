import React, { useState, useEffect } from "react";
import { addSubject, getSubjects, register } from "../api";
import Modal from "react-modal";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
  },
};

const AddStudentModal = ({ isOpen, onClose, onAddStudent }) => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    class: "",
    username: "",
    password: "",
    selectedSubjects: [],
  });

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSubjectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      selectedSubjects: selectedOptions.map((option) => option.value),
    });
  };

  const handleAddStudent = async () => {
    // Call the API to add the student with formData
    const response = await register({
      ...formData,
      sclass: formData.class,
      subjects: formData.selectedSubjects,
    });

    onAddStudent({
      ...formData,
      subjects: formData.selectedSubjects,
    });
    setFormData({
      name: "",
      age: "",
      class: "",
      username: "",
      password: "",
      selectedSubjects: [],
    });
    onClose();
  };

  const handleCreate = async (data) => {
    try {
      const newSubjectData = await addSubject(data);
      setSubjects([...subjects, newSubjectData]);
      setFormData({
        ...formData,
        selectedSubjects: [...formData.selectedSubjects, newSubjectData.name],
      });
      setNewSubject("");
    } catch (error) {
      console.error("Error creating new subject:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Add Student Modal"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
      <div>
        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-medium">Age</label>
        <input
          type="number"
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-medium">Class</label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          value={formData.class}
          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-medium">Username</label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2 font-medium">Subjects</label>
        {/* <Select
          options={subjects.map((subject) => ({
            value: subject.name,
            label: subject.name,
          }))}
          isMulti
          onChange={handleSubjectChange}
          value={subjects.filter((subject) =>
            formData.selectedSubjects.includes(subject.name)
          )}
        /> */}
        <CreatableSelect
          isClearable
          onChange={handleSubjectChange}
          onCreateOption={handleCreate}
          options={subjects.map((subject) => ({
            value: subject.name,
            label: subject.name,
          }))}
          isMulti
          value={formData.selectedSubjects.map((subject) => ({
            value: subject,
            label: subject,
          }))}
        />
        {/* <div className="mt-2">
          <input
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter new subject"
            value={newSubject}
            onChange={handleNewSubjectChange}
          />
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCreateSubject}
          >
            Create Subject
          </button>
        </div> */}
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddStudent}
        >
          Add Student
        </button>
        <button
          className="ml-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default AddStudentModal;

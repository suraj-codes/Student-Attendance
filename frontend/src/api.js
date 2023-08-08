import axios from "axios";

const API_BASE_URL = "https://student-attendance-three.vercel.app"; // Change to your backend URL

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const register = async (data) => {
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, data);
  } catch (error) {
    throw error.response.data.message;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    throw error.response.data.message;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const markAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/attendance`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const updateAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/attendance/update`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getAttendance = async (studentId, date) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/attendance/${studentId}`,
      { date }
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getAllAttendance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendance`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const addSubject = async (subject) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subjects`, {
      name: subject,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

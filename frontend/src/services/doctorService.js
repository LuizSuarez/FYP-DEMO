// src/services/doctorService.js
import axios from "axios";

const API = "http://localhost:5000/api";

// 🔹 Public
const getDoctors = async () => {
  const { data } = await axios.get(`${API}/doctors`);
  return data.doctors;
};

const getDoctor = async (id) => {
  const { data } = await axios.get(`${API}/doctors/${id}`);
  return data.doctor;
};

// 🔹 Clinician
const updateSelfProfile = async (token, updates) => {
  const { data } = await axios.put(`${API}/doctors/self`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🔹 User actions
const shareReport = async (token, payload) => {
  const { data } = await axios.post(`${API}/doctor-connect/share`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const bookAppointment = async (token, payload) => {
  const { data } = await axios.post(`${API}/doctor-connect/appointments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const getConsultations = async (token) => {
  const { data } = await axios.get(`${API}/doctor-connect/consultations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.consultations;
};

const addAnnotation = async (token, consultationId, text) => {
  const { data } = await axios.post(
    `${API}/doctor-connect/consultations/${consultationId}/annotations`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// 🔹 Admin
const verifyDoctor = async (token, doctorId) => {
  const { data } = await axios.patch(
    `${API}/doctor-connect/clinician/${doctorId}/verify`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export {
  getDoctors,
  getDoctor,
  updateSelfProfile,
  shareReport,
  bookAppointment,
  getConsultations,
  addAnnotation,
  verifyDoctor,
};
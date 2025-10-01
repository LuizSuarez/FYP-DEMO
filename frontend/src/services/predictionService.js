import axios from "axios";

const FLASK_API_URL = "http://localhost:5000"; // Flask backend

// Send file directly to Flask
const predictFromFile = async (file) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${FLASK_API_URL}/predict`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 20000,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Flask prediction API error:", error.message);
    throw error;
  }
}

export { predictFromFile };
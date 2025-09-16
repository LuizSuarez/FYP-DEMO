import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// ✅ Get current logged-in user profile
export const getUserProfile = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

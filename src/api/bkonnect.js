import baseApi from "./baseApi";
import axios from "axios";

export const registerOnBkonnect = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BKONNECT_URL}/api/auth/register`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

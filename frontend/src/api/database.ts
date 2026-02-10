import axios from "@/lib/axios";

export const resetDatabase = async () => {
  const res = await axios.post("/database/reset");
  return res.data.message;
};

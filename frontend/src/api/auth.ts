import axios from "../lib/axios";

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await axios.post("/auth/signup", { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("/auth/logout");
  return res.data;
};

export const verifyAuthStatus = async () => {
  const res = await axios.get("/auth/verify");
  return res.data;
};

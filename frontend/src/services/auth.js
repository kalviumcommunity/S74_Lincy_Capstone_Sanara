import api from "./api";

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const signup = async ({ email, password }) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

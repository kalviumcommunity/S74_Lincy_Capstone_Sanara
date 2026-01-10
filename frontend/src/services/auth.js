import api from "./api";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
};

export const signup = async (data) => {
  await api.post("/auth/register", data);
};

export const logout = () => {
  localStorage.removeItem("token");
};

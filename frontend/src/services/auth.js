import api from "./api";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", {
    email: normalizeEmail(email),
    password,
  });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const signup = async ({ email, password }) => {
  const res = await api.post("/auth/register", {
    email: normalizeEmail(email),
    password,
  });
  return res.data;
};

export const googleLogin = async (credential) => {
  const res = await api.post("/auth/google", { credential });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

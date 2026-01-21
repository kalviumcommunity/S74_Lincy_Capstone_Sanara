import api from "./api";

/* EMAIL SIGNUP */
export const signup = async ({ email, password }) => {
  const res = await api.post("/auth/register", {
    email,
    password,
  });
  return res.data;
};

/* EMAIL LOGIN */
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

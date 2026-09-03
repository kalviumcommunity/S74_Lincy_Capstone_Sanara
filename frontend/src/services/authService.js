import api from "./api";

export const authService = {
  async register(name, email, password) {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  async exportData() {
    const res = await api.get("/auth/export-data", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sanara_personal_intelligence_data.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async deleteAccount() {
    const res = await api.delete("/auth/delete-account");
    localStorage.removeItem("token");
    return res.data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

import api from "./api";

export const situationService = {
  // Post messy text -> Receive structured situation
  async untangle(rawInput) {
    const res = await api.post("/situations/untangle", { rawInput });
    return res.data;
  },

  // Fetch situations list (active / resolved)
  async getSituations(status = "") {
    const url = status ? `/situations?status=${status}` : "/situations";
    const res = await api.get(url);
    return res.data;
  },

  // Fetch single situation details with threads, decisions, events, reflections
  async getSituation(id) {
    const res = await api.get(`/situations/${id}`);
    return res.data;
  },

  // Reality Check reflection
  async performRealityCheck(id, claim) {
    const res = await api.post(`/situations/${id}/reality-check`, { claim });
    return res.data;
  },

  // Decision Room create/update
  async manageDecision(id, payload) {
    const res = await api.post(`/situations/${id}/decision`, payload);
    return res.data;
  },

  // Resolve situation with outcome tracking
  async resolveSituation(id, payload) {
    const res = await api.post(`/situations/${id}/resolve`, payload);
    return res.data;
  },

  // Get My Map node dataset
  async getMapData() {
    const res = await api.get("/situations/map/data");
    return res.data;
  },

  // Update thread action items & status
  async updateThreadActionItems(threadId, payload) {
    const res = await api.put(`/situations/threads/${threadId}/action-items`, payload);
    return res.data;
  },

  // Add thread progress update
  async addThreadUpdate(threadId, content) {
    const res = await api.post(`/situations/threads/${threadId}/updates`, { content });
    return res.data;
  },

  // Simulate conversation
  async simulateConversation(payload) {
    const res = await api.post("/situations/simulate-conversation", payload);
    return res.data;
  },

  // Pattern intelligence
  async getPatterns() {
    const res = await api.get("/situations/patterns");
    return res.data;
  },

  // Ask Sanara history query
  async askSanara(query) {
    const res = await api.post("/situations/ask", { query });
    return res.data;
  },
};

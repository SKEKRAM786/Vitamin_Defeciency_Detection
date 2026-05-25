// Mongo auth runs on Node (vitamin/server). Flask ML/chatbot stays on port 5000.
export const AUTH_API_BASE =
  process.env.REACT_APP_AUTH_API || "http://localhost:5001";

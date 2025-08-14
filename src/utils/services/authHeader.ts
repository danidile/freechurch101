// services/authHeader.ts
export function getAuthHeader() {
  const token = localStorage.getItem("token"); // or however your app stores it
  console.log(
    "🔑 Auth token being sent:",
    token ? `${token.slice(0, 10)}...` : "MISSING"
  );

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}

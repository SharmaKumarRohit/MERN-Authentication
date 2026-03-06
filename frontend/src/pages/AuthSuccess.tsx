import { BASE_URL } from "@/constant";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get("token");
      if (accessToken) {
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        try {
          const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!response.data.success) {
            throw new Error("Google authentication failed");
          }
          setUser(response.data);
          navigate("/");
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    handleAuth();
  }, [navigate]);
  return (
    <h2 className="text-center py-10 text-lg font-medium font-inter text-neutral-800">
      Logging...
    </h2>
  );
}

export default AuthSuccess;

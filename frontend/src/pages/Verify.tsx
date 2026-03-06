import { BASE_URL } from "@/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    let timeOutId: ReturnType<typeof setTimeout>;
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/verify`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.data.success) {
          setStatus("✅ Email Verified Successfully");
          timeOutId = setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("❌ Invalid or Expired Token");
        }
      } catch (error) {
        setStatus("❌ Verification failed. Please try again.");
      }
    };
    verifyEmail();
    return () => clearTimeout(timeOutId);
  }, [token, navigate]);
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-neutral-800">{status}</h2>
      </div>
    </div>
  );
}

export default Verify;

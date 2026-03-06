import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ChangePassword() {
  const { email } = useParams();
  const [isError, setIsError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setIsError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setIsError("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setIsError("Both password do not match");
      return;
    }
    try {
      setIsPending(true);
      const response = await axios.post(
        `${BASE_URL}/user/change-password/${email}`,
        { newPassword, confirmPassword },
      );
      if (!response.data.success) {
        throw new Error("Failed to change password");
      }
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      let errorMsg = "Something Went Wrong!";
      if (axios.isAxiosError(error)) {
        errorMsg = error?.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setIsError(errorMsg);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-5 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Change Password
        </h2>
        <p className="text-sm text-neutral-500 text-center mb-4">
          Set a new password for <span className="font-semibold">{email}</span>
        </p>
        {isError && (
          <p className="text-red-600 border border-neutral-200 p-2 rounded-sm font-medium text-sm mb-3 text-center">
            {isError}
          </p>
        )}
        {success && (
          <p className="text-green-600 border border-neutral-200 p-2 rounded-sm font-medium text-sm mb-3 text-center">
            {success}
          </p>
        )}
        <div className="space-y-4">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <Button
            onClick={handleChangePassword}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constant";
import axios from "axios";
import { CheckCircle, Loader2, RotateCcw } from "lucide-react";
import { useState, type ReactNode, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function VerifyOTP() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOtp(updatedOTP);
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerified(false);
    const OTP = otp.join("");
    if (OTP.length !== 6) {
      setIsError("Please enter 6-digit OTP to verify email");
      return;
    }
    try {
      setIsError("");
      setIsPending(true);
      const response = await axios.post(
        `${BASE_URL}/user/verify-otp/${email}`,
        { otp: OTP },
      );
      if (!response.data.success) {
        throw new Error("Failed to verify OTP");
      }
      setSuccessMsg(response.data.message);
      setTimeout(() => {
        navigate(`/change-password/${email}`);
      }, 2000);
    } catch (error) {
      let errorMsg = "Something Went Wrong!";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setIsError(errorMsg);
    } finally {
      setIsPending(false);
    }
  };

  const clearOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setIsError("");
    inputRef.current[0]?.focus();
  };
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-800">
            Verify your email
          </h2>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to <span>{email}</span>
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-neutral-800">
              Enter Verification Code
            </CardTitle>
            <CardDescription>
              {isVerified
                ? "Code verfied successfully! Redirecting..."
                : "Enter the 6-digit code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>{isError}</AlertDescription>
              </Alert>
            )}
            {successMsg && (
              <p className="text-green-600 border border-neutral-200 p-2 rounded-sm font-medium text-sm mb-3 text-center">
                {successMsg}
              </p>
            )}
            {isVerified ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <CheckCircle className="size-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">
                    Verification Successfull
                  </h3>
                  <p className="text-muted-foreground">
                    Your email has been verified. You'll be redirected to reset
                    your password
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Redirecting...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-6">
                  {otp.map(
                    (digit: string, index: number): ReactNode => (
                      <Input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        maxLength={1}
                        ref={(el) => {
                          inputRef.current[index] = el;
                        }}
                        className="w-12 h-11 text-center text-xl font-semibold"
                      />
                    ),
                  )}
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleVerify}
                    disabled={isPending || otp.some((digit) => digit === "")}
                    className="w-full"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearOTP}
                    className="w-full"
                    disabled={isPending || isVerified}
                  >
                    <RotateCcw className="size-4" /> Clear
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              You entered wrong email{" "}
              <Link
                to="/forgot-password"
                className="text-neutral-800 hover:underline font-medium"
              >
                Go Back
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className="text-center text-xs text-muted-foreground">
          <p>
            For testing purpose, use code:{" "}
            <span className="font-mono font-medium">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;

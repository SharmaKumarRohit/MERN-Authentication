import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/constant";
import { toast } from "sonner";

function ForgotPassword() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleForgotPassword = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsPending(true);
      const response = await axios.post(`${BASE_URL}/user/forgot-password`, {
        email,
      });
      if (!response.data.success) {
        throw new Error("Failed to send email, try again");
      }
      navigate(`/verify-otp/${email}`);
      toast.success(response.data.message);
      setEmail("");
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
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
            Reset your password
          </h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset
            your password
          </p>
        </div>
        <Card className="bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-neutral-800">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email address to recieve a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>{isError}</AlertDescription>
              </Alert>
            )}
            {isSubmitted ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <CheckCircle className="size-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Check your inbox</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p>
                    If you don't see the email, check your spam folder or{" "}
                    <button
                      className="text-primary hover:underline font-medium cursor-pointer"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Try Again
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2 relative text-neutral-800">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
                <Button className="w-full relative cursor-pointer">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-0.5 size-4 animate-spin" /> Sending
                      reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-neutral-800 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;

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
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
}

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = formData;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username.trim() || !email || !password) {
      return toast.warning("All fields are required.", {
        position: "top-center",
      });
    }
    try {
      setIsPending(true);
      const response = await axios.post(`${BASE_URL}/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);
      setFormData({ username: "", email: "", password: "" });
      navigate("/verify");
    } catch (error) {
      let errorMsg = "Something Went Wrong!";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg, { position: "top-center" });
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-sm font-inter">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="link"
                    type="button"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-neutral-500" />
                    ) : (
                      <Eye className="text-neutral-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full disabled:opacity-75"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex gap-1.5 items-center">
                <Loader2 className="animate-spin" />
                Creating account...
              </div>
            ) : (
              "Signup"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;

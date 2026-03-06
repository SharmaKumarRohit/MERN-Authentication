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
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import logo from "../assets/logo.png";

interface FormData {
  email: string;
  password: string;
}

function Login() {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warning("All fields are required.", {
        position: "top-center",
      });
    }
    try {
      setIsPending(true);
      const response = await axios.post(`${BASE_URL}/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success(response.data.message);
      setFormData({ email: "", password: "" });
      setUser(response.data);
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken),
      );
      navigate("/");
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
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-sm font-inter">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot Your Passowrd?
                  </Link>
                </div>
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
                Logging account...
              </div>
            ) : (
              "Login"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(`${BASE_URL}/auth/google`, "_self")}
          >
            <img src={logo} className="w-10" alt="logo" />
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;

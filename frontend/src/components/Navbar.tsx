import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookA, BookOpen, LogOutIcon, UserIcon } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/constant";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";

function Navbar() {
  const { user, setUser } = useAuth();
  const logoutHandler = async () => {
    const token = localStorage.getItem("accessToken");
    const accessToken: string | null = token ? JSON.parse(token) : null;
    try {
      const response = await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (response.data.success) {
        setUser(null);
        toast.success(response.data.message);
        localStorage.clear();
      }
    } catch (error) {
      console.dir(error);
      let errorMsg = "Something Went Wrong!";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg, { position: "top-center" });
    }
  };
  return (
    <>
      <nav className="max-w-7xl px-4 sm:px-6 mx-auto flex justify-between items-center h-full">
        <Link to="/" className="flex gap-2 items-center">
          <BookOpen className="text-neutral-800" />
          <h1 className="font-bold text-xl">App</h1>
        </Link>
        <ul className="flex gap-7 items-center font-medium">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={
                        user && user.user?.avatar
                          ? user.user?.avatar
                          : "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookA />
                    Notes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={logoutHandler}
                  >
                    <LogOutIcon />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

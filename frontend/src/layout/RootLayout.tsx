import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <header className="h-14 border-b border-neutral-200">
        <Navbar />
      </header>
      <main className="h-[calc(100vh-56px)] bg-neutral-100">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;

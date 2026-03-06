import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  VerifyEmail,
  Verify,
  ForgotPassword,
  VerifyOTP,
  ChangePassword,
  CreateNote,
  AuthSuccess,
} from "./pages";
import RequireAuth from "./components/RequireAuth";
import RootLayout from "./layout/RootLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp/:email" element={<VerifyOTP />} />
      <Route path="/change-password/:email" element={<ChangePassword />} />
      <Route
        path="/create-note"
        element={
          <RequireAuth>
            <CreateNote />
          </RequireAuth>
        }
      />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

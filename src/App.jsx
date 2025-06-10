import { useEffect, useMemo } from "react";
import "./App.css";
import Header from "./component/Header/Header";
import Login from "./pages/auth/Login";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import Challenge from "./component/Challenge/Challenge";
import Admin from "./pages/admin/Admin";
import UsersList from "./component/admin/users/UsersList";
import Scorebord from "./component/admin/Scorebord/Scorebord";
import Challengs from "./component/admin/challengs/Challengs";
import Submissions from "./component/admin/submissions/Submissions";
import Notifications from "./component/admin/notifications/Notifications";
import Account from "./component/admin/account/Account";
import AddChallenge from "./component/admin/challengs/AddChallenge";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/auth/ResetPassword";
import EditChallenge from "./component/admin/challengs/EditChallenge";
import Category from "./component/admin/Category/Category";
import AddNotifications from "./component/admin/notifications/AddNotifications";
import Profile from "./component/profile/Profile";
import Notification from "./component/notification/Notification";
import Scoreboard from "./component/scoreboard/Scoreboard";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import Competition from "./component/admin/competition/Competition";
import AddCompetition from "./component/admin/competition/AddCompetition";
import EditCompetition from "./component/admin/competition/EditCompetition";
import Competations from "./component/Competation/Competations";
import ForgetPassword from "./pages/auth/ForgetPassword";
import { Toaster } from "sonner";
import Footer from "./component/Footer/Footer";
import AppErrorBoundary from "./ErrorBoundary";
import NotFound from "./component/notFound/NotFound";
import AdminProtect from "./component/ProtectedRoute/AdminProtect";
import { useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-center" />
      {!isAdminRoute && <Header />}
      <Outlet />
      {!isAdminRoute && <Footer />}
    </QueryClientProvider>
  );
};

function App() {
  const { user } = useSelector((state) => state.users);
  useEffect(() => {
    if (window.self !== window.top) {
      window.top.location.href = window.location.href;
    }
  }, []);
  const userIsCreator = useMemo(
    () => user?.roles?.includes("CreatorCTF"),
    [user?.roles]
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/scoreboard",
          element: (
            <ProtectedRoute>
              <Scoreboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/challenge",
          element: (
            <ProtectedRoute>
              <Challenge />
            </ProtectedRoute>
          ),
        },

        {
          path: "/competitions",
          element: (
            <ProtectedRoute>
              <Competations />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notification",
          element: (
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          ),
        },
        {
          path: "/setting",
          element: (
            <ProtectedRoute>
              <Challenge />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },

        {
          path: "/admin",
          element: (
            <AdminProtect>
              <Admin />
            </AdminProtect>
          ),
          children: [
            {
              path: "users",
              element: !userIsCreator ? (
                <UsersList />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "scorebord",
              element: !userIsCreator ? (
                <Scorebord />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "challenges",
              element: <Challengs />,
            },
            {
              path: "addChallenge",
              element: <AddChallenge />,
            },
            {
              path: "edit-challenge/:id",
              element: <EditChallenge />,
            },
            {
              path: "category",
              element: <Category />,
            },
            {
              path: "competition",
              element: !userIsCreator ? (
                <Competition />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "addCompetition",
              element: !userIsCreator ? (
                <AddCompetition />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "edit-competition",
              element: !userIsCreator ? (
                <EditCompetition />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "submissions",
              element: !userIsCreator ? (
                <Submissions />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "notifications",
              element: !userIsCreator ? (
                <Notifications />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "addnotification",
              element: !userIsCreator ? (
                <AddNotifications />
              ) : (
                <Navigate to="/admin" />
              ),
            },
            {
              path: "account",
              element: !userIsCreator ? <Account /> : <Navigate to="/admin" />,
            },
          ],
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
  return (
    <AppErrorBoundary>
      <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}

export default App;

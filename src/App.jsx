import { Fragment, useEffect } from "react";
import "./App.css";
import Header from "./component/Header/Header";
import Login from "./pages/auth/Login";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import Challenge from "./component/Challenge/Challenge";
import Admin from "./pages/admin/Admin";
import UsersList from "./component/admin/users/UsersList";
import AdminDashboard from "./component/admin/AdminDashboard/AdminDashboard";
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

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <Fragment>
      <Toaster richColors position="top-center" />
      {!isAdminRoute && <Header />}
      <Outlet />
      {!isAdminRoute && <Footer />}
    </Fragment>
  );
};

function App() {
  useEffect(() => {
    if (window.self !== window.top) {
      window.top.location.href = window.location.href;
    }
  }, []);

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
          path: "/competations",
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
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "adminDashboard",
              element: <AdminDashboard />,
            },
            {
              path: "users",
              element: (
                <AdminProtect>
                  {" "}
                  <UsersList />
                </AdminProtect>
              ),
            },
            {
              path: "scorebord",
              element: (
                <AdminProtect>
                  <Scorebord />
                </AdminProtect>
              ),
            },
            {
              path: "challengs",
              element: <Challengs />,
            },
            {
              path: "addChallenge",
              element: <AddChallenge />,
            },
            {
              path: "edit-challenge",
              element: <EditChallenge />,
            },
            {
              path: "category",
              element: <Category />,
            },
            {
              path: "competition",
              element: (
                <AdminProtect>
                  <Competition />
                </AdminProtect>
              ),
            },
            {
              path: "addCompetition",
              element: (
                <AdminProtect>
                  <AddCompetition />
                </AdminProtect>
              ),
            },
            {
              path: "edit-competition",
              element: (
                <AdminProtect>
                  <EditCompetition />
                </AdminProtect>
              ),
            },
            {
              path: "submissions",
              element: (
                <AdminProtect>
                  <Submissions />
                </AdminProtect>
              ),
            },
            {
              path: "notifications",
              element: (
                <AdminProtect>
                  <Notifications />
                </AdminProtect>
              ),
            },
            {
              path: "addnotification",
              element: (
                <AdminProtect>
                  <AddNotifications />
                </AdminProtect>
              ),
            },
            {
              path: "account",
              element: (
                <AdminProtect>
                  <Account />
                </AdminProtect>
              ),
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

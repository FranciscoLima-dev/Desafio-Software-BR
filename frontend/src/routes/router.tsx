import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { CreateTaskPage } from "../pages/tasks/CreateTaskPage";
import { EditTaskPage } from "../pages/tasks/EditTaskPage";
import { TaskHistoryPage } from "../pages/tasks/TaskHistoryPage";
import { TasksPage } from "../pages/tasks/TasksPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/tasks", element: <TasksPage /> },
          { path: "/tasks/new", element: <CreateTaskPage /> },
          { path: "/tasks/:id/edit", element: <EditTaskPage /> },
          { path: "/tasks/:id/history", element: <TaskHistoryPage /> },
        ],
      },
    ],
  },
]);

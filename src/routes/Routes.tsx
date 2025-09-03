import { createBrowserRouter } from "react-router-dom";
import PricingPackages from "@/components/OrderPage/PricingPackages";
import MainLayout from "../Layouts/MainLayout";
import SubjectSelection from "@/components/OrderPage/SubjectSelection";
import OrderSummary from "@/components/OrderPage/OrderSummary";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SubjectSelection />,
      },
      {
        path: "package",
        element: <PricingPackages />,
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <OrderSummary />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

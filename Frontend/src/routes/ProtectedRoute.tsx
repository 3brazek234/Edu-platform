import { usePackageStore, useSubjectStore } from "@/store/store";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { item: subject } = useSubjectStore();
  const { item: pkg } = usePackageStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (subject === null || !pkg) {
      alert("Please select a subject and package before proceeding.");
      navigate("/");
    }
  }, [subject, pkg, navigate]);

  return <>{children}</>;
};

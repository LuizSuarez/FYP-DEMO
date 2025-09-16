import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dna } from "lucide-react";
import { useAuthService } from "../services/authService";

export default function VerifyEmail() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthService();

  // Get query param (e.g. ?status=success)
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    if (status === "success") {
      toast({ title: "✅ Email verified successfully!" });

      const timer = setTimeout(() => {
        navigate("/consent?status=success", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, toast, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white text-center border border-gray-200">
        {/* Logo + App Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-2">
            <Dna className="h-6 w-6 text-cyan-600" />
          </div>
          <h1 className="text-xl font-bold text-cyan-600">DNAlytics</h1>
        </div>

        {status === "success" ? (
          <>
            <h2 className="text-2xl font-semibold text-primary">
              Email Verified 🎉
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              Redirecting you to the consent form...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-cyan-600">
              Verify Your Email
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              We’ve sent a verification link to your email.
              <br />
              Please click it to verify your account.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

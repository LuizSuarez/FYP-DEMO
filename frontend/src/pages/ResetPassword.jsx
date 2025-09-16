import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuthService } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams(); // ✅ fetches your 315a186f... token
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuthService();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword.length < 10) {
      toast({
        title: "Password must be at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      toast({ title: res.msg || "Password reset successful!" });
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to reset password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          className="w-full dna-gradient"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;

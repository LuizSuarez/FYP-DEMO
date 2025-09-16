import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuthService } from "../services/authService";

export default function ForgotPassword() {
  const { toast } = useToast();
  const { forgotPassword } = useAuthService();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      toast({ title: res.msg || "Password reset link sent to your email!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send link", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button className="w-full dna-gradient" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
}

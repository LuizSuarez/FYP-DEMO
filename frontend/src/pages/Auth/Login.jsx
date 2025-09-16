import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Layout } from "../../components/Layout";
import { Dna, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../../services/authService";

export default function Login() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { login } = useAuthService();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignIn = async () => {
    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login success:", res);

      toast({ title: "Welcome back!" });

      // Role-based navigation
      const role = res?.user?.role || "User";
      if (role === "Admin") navigate("/admin-dashboard");
      else if (role === "Clinician") navigate("/clinician-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSignIn();
    }
  };

  return (
    <Layout showSidebar={false}>
      <div
        className="min-h-screen flex items-center justify-center p-6"
        onKeyDown={handleKeyDown}
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 dna-gradient p-2.5">
                <Dna className="h-full w-full text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              <Button
                className="w-full dna-gradient"
                size="lg"
                onClick={handleSignIn}
              >
                Sign In
              </Button>

          {/* Footer */}
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="hover:text-indigo-600 underline">
                  Sign Up
                </Link>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="hover:text-primary underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}



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
import { Dna, User, Users, Stethoscope, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../../services/authService";

export default function SignUp() {
  const { toast } = useToast();
  const [userType, setUserType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    license: "",
    institution: "",
  });

  const navigate = useNavigate();
  const { register } = useAuthService();

  const userTypeIcons = { user: User, admin: Users, clinician: Stethoscope };
  const userTypeDescriptions = {
    user: "Personal genomic analysis and health insights",
    admin: "Administrative tools and user management",
    clinician: "Patient data analysis and clinical decision support",
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        licenseNumber: formData.license,
        role:
          userType === "admin"
            ? "Admin"
            : userType === "clinician"
            ? "Clinician"
            : "User",
      };

      const res = await register(userData);
      console.log("Signup success:", res.verificationToken);

      toast({ title: "Account created!" });

      if (userType === "admin") navigate(`/verify-email-admin/${res.verificationToken}`);
      else if (userType === "clinician") navigate(`/verify-email-clinician/${res.verificationToken}`);
      else navigate(`/verify-email/${res.verificationToken}`);
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSignUp();
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
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">
              Choose your account type and fill in your details
            </p>
          </div>

          {/* Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Join DNAlytics and start your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Account type selection */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {["user", "admin", "clinician"].map((type) => {
                    const Icon = userTypeIcons[type];
                    return (
                      <Card
                        key={type}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          userType === type
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setUserType(type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium capitalize">{type}</div>
                              <div className="text-sm text-muted-foreground">
                                {userTypeDescriptions[type]}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Abdul"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Moeez"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="abdul.moeez@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password with toggle */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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

              {/* Extra fields */}
              {userType === "clinician" && (
                <div className="space-y-2">
                  <Label htmlFor="license">Medical License Number</Label>
                  <Input
                    id="license"
                    placeholder="Enter your license number"
                    value={formData.license}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {userType === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Code</Label>
                  <Input
                    id="adminCode"
                    placeholder="Enter your admin code"
                    value={formData.adminCode}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <Button
                className="w-full dna-gradient"
                size="lg"
                onClick={handleSignUp}
              >
                Create Account
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:text-primary underline text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

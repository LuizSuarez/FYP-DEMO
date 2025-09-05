import { useState } from "react";
import { useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Layout } from "../components/Layout";
import { Dna, User, Users, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "../services/authService"; // ✅ use service

export default function Auth() {
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState("login");
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    license: "",
    institution: "",
  });

  const navigate = useNavigate();
  const { register, login } = useAuthService(); // ✅ bring register + login from service

  const userTypeIcons = {
    user: User,
    admin: Users,
    clinician: Stethoscope,
  };

  const userTypeDescriptions = {
    user: "Personal genomic analysis and health insights",
    admin: "Administrative tools and user management",
    clinician: "Patient data analysis and clinical decision support",
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ✅ Sign Up with backend
  const handleSignUp = async () => {
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role:
          userType === "admin"
            ? "Admin"
            : userType === "clinician"
            ? "Clinician"
            : "User",
        // adjust mapping if backend expects "User", "Clinician", "Admin"
      };

      console.log(userData);
      const res = await register(userData);
      console.log("Signup success:", res);

      toast({
        title: "Account created!",
      });

      // Navigate after signup
      if (userType === "admin") {
        navigate("/researcher-dashboard");
      } else if (userType === "clinician") {
        navigate("/clinician-dashboard");
      } else {
        navigate("/consent");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed");
    }
  };

  // ✅ Sign In with backend
  const handleSignIn = async () => {
    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login success:", res);

      toast({
      title: "Welcome back!",
    });

    if (userType === "admin") {
      navigate("/admin-dashboard");
    } else if (userType === "clinician") {
      navigate("/clinician-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Login failed");
  }
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 dna-gradient p-2.5">
                <Dna className="h-full w-full text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Welcome to DNAlytics</h1>
            <p className="text-muted-foreground">
              {authMode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </p>
          </div>

          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* --- LOGIN TAB --- */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button
                    className="w-full dna-gradient"
                    size="lg"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
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
            </TabsContent>

            {/* --- REGISTER TAB --- */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Choose your account type and fill in your details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Type Selection */}
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
                                  <div className="font-medium capitalize">
                                    {type}
                                  </div>
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

                  {/* Form Fields */}
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

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

                  {userType === "researcher" && (
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        placeholder="Your research institution"
                        value={formData.institution}
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

                  <div className="text-center text-sm text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" className="hover:text-primary underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="hover:text-primary underline"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

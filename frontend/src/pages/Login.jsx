import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true); // Start loading
    setError(""); // Reset error

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      if (data.success) {
        // Redirect to the dashboard after successful login
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message); // Set the error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleLogin = () => {
    navigate("/auth/google");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#c4cdec] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", '')}>
          <Card className="bg-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl p-2">Welcome Back</CardTitle>
              <CardDescription className="text-[13px] p-1">
                Log in to continue your financial journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="ml-auto text-sm hover:underline underline-offset-4">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition-colors hover:bg-gradient-to-r from-blue-500 to-teal-500 py-2 px-3 rounded-md duration-300 cursor-pointer hover:text-gray-900 ease-in-out"
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>

              {error && <div className="mt-2 text-red-500 text-center">{error}</div>} {/* Error message */}

              <Button
                variant="outline"
                className="w-full cursor-pointer mt-4"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

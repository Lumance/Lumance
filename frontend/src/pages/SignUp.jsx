import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed. Please try again.");
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        throw new Error(data.message || "Sign-up failed.");
      }
    } catch (err) {
      setError(err.message); // Display error message
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    window.location.href = "http://localhost:3000/auth/google";
    try {
      // Redirect the user to the backend route to initiate Google OAuth

      const response = await fetch('http://localhost:3000/auth/google/callback', {
        method: 'GET',
        credentials: 'include', // To maintain session or cookies
      });

      console.log(response);

      const data = await response.json();

      if (data.success) {
        navigate('/dashboard'); // Navigate to dashboard after successful Google sign-up
      } else {
        // Handle failure (optional)
        console.log('Google sign-up failed');
      }
    } catch (error) {
      console.error("Error during Google sign-up:", error);
      setError(error.message); // Display error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#c4cdec] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", '')}>
          <Card className="bg-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join the Journey</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Create an account to take control of your spending and savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button
                    type="submit"
                    className="w-full transition-colors hover:bg-gradient-to-r from-pink-600 to-pink-800 hover:text-gray-950 py-2 px-3 rounded-md duration-300 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </div>
              </form>

              <Button
                variant="outline"
                className="w-full cursor-pointer mt-4"
                onClick={handleGoogleSignUp} // Calls the Google OAuth flow
              >
                Sign Up with Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

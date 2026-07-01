"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useDataContext } from "@/context/dataContext";

export default function Component() {
  const { userData, setUserData, isLoggedIn, setIsLoggedIn } = useDataContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    
    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Reset error message before API call
    setErrorMessage("");

    // Make API call to the signup endpoint
    try {
      const response = await fetch(
        `/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "signup",
            name: name,
            email: email,
            password: password,
            role: role,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.log(data)
        throw new Error(data.error || "Something went wrong");
      }
      if (data) {
        const { id, name, email, role } = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id, name, email, role }));
        setUserData({ id, name, email, role });
        setIsLoggedIn(true);
        router.push("/Routes/Dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm">
      <h2 className="text-xl font-bold mb-6 text-center text-slate-100">
        Create your account
      </h2>
      {errorMessage && (
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider text-center mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-400">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-900/80 border-slate-800 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-gray-200">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-gray-200">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-gray-200">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-gray-200">
            Role
          </label>
          <Select onValueChange={setRole} required>
            <SelectTrigger
              id="role"
              className="w-full border-slate-800 focus:ring-blue-500 focus:border-blue-500 bg-slate-900/80 text-slate-200"
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 text-slate-200 border-slate-800">
              <SelectItem value="DEVELOPER">Developer</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 focus:ring-blue-500 text-white font-semibold"
        >
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-slate-500 text-xs">Already have an account?</span>
      </div>
      {/* <Button
        className="w-full mt-4 bg-gray-700 hover:bg-gray-600 focus:ring-blue-500 text-gray-200"
        onClick={() => console.log("Sign up with Google")}
      >
        Sign up with Google
      </Button> */}

      <Link href="/" passHref>
        <Button className="w-full mt-3 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium text-sm">
          Sign In Instead
        </Button>
      </Link>
    </div>
  );
}

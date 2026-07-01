"use client"
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDataContext } from '@/context/dataContext'


export default function LoginComponent() {
  const {userData, setUserData, isLoggedIn,setIsLoggedIn} = useDataContext()
  const router = useRouter();
  // const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) { // Ensure email, password, and role fields are filled
      alert("Please fill in all fields before logging in.");
      return;
    }
  
    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action:"login",  
          name,
          "email":email,
          "password":password,
        })
      });

  
      if (response.ok) {
        const data = await response.json();
        const {id , name, email , role} = data.user
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', JSON.stringify({id, name, email, role}));
        setUserData({id , name, email , role})
        setIsLoggedIn(true);
        router.push("/Routes/Dashboard"); 
      } else {
        const errorData = await response.json();
        console.log(errorData)
        alert(errorData.error || "Login failed");
        if(errorData.error === 'User not found'){
          router.push('/Routes/signup')
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error)
    }
  }
  
  return (
    <div className="glass-card p-8 rounded-2xl w-full max-w-sm">
      <h2 className="text-xl font-bold mb-6 text-center text-slate-100">Sign in to Workstream</h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name </label>
          <Input 
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/80 border-slate-800 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
          <Input 
            id="email"
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900/80 border-slate-800 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
          <Input 
            id="password"
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-900/80 border-slate-800 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-500"
          />
        </div>
        {/* <div className="space-y-2">
          <label htmlFor="role" className="text-gray-200">Role</label>
          <Select onValueChange={setRole} required>
            <SelectTrigger id="role" className="w-full border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-200">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-200">
              <SelectItem value="DEVELOPER">Developer</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <Button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 focus:ring-blue-500 text-white font-semibold"
        >
          Sign in
        </Button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-slate-500 text-xs">Don't have an account?</span>
      </div>
      {/* <Button 
        className="w-full mt-4 bg-gray-700 hover:bg-gray-600 focus:ring-blue-500 text-gray-200"
        onClick={() => console.log("Sign in with Google")}
      >
        Sign in with Google
      </Button> */}

      <Link href="/Routes/signup" passHref>
        <Button 
          className="w-full mt-3 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium text-sm" 
        >
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

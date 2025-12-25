import React from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Navigate = useNavigate(); 

  const handlelogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if(!res.ok){
        setError(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");
      Navigate("/home");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("server error");
    
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-indigo-500 ">
      <div className="border-2 border-indigo-500 bg-white rounded-lg ">
        <h2 className="font-[Lato] text-2xl font-bold pt-2 ml-15">login</h2>
        <form
          action=""
           onSubmit={handlelogin}
          className="flex flex-col justify-center items-center   pt-13 pb-15 pl-15 pr-15 gap-3"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className=" mr-2.5">
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className=" border-2 border-black"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className=" mr-2.5">
              Password
            </label>
            <input
              className=" border-2 border-black"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              
            />
          </div>
          <p>{error}</p>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 border w-25 cursor-pointer "
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

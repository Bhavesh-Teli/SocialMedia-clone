import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/v1/users/register", input,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="text-center text-xl font-bold">logo</h1>
          <p className="text-center text-sm text-gray-500">Signup to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className="font-medium">UserName</Label>
          <Input 
          type="text" 
          className="focus-visible:ring-transparent my-2" 
          name="username" 
          value={input.username} 
          onChange={changeEventHandler} />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input 
          type="Email" 
          className="focus-visible:ring-transparent my-2" 
          name="email" value={input.email} 
          onChange={changeEventHandler} />
        </div>

        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-2"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>

        <Button type="submit">SignUp</Button>
        <span>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
      </form>
    </div>
  );
};

export default SignUp;

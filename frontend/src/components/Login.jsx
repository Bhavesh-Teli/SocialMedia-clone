import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
const Login = () => {
  const [input, setInput] = useState({
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
      const response = await axios.post("http://localhost:5000/api/v1/users/login", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setInput({
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
          <p className="text-center text-sm text-gray-500">Login to see photos and videos from your friends</p>
        </div>

        <div>
          <Label className="font-medium">Email</Label>
          <Input type="Email" className="focus-visible:ring-transparent my-2" name="email" value={input.email} onChange={changeEventHandler} />
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
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;

import { TrendingUp, Home, Search, MessageCircle, Heart, PlusSquare, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/users/logout", { withCredentials: true });
      if (response.data.success) {
        dispatch(setAuthUser({ user: null}));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));

        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
 
  const sidebarHandler = (texttype) => {
    if (texttype === "Logout") logoutHandler();
    else if (texttype === "Create") setOpen(true);
  };
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="avatar" />
          <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="my-8 pl-3 text-2xl font-bold">Logo</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div onClick={() => sidebarHandler(item.text)} key={index} className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer p-3 my-3">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;

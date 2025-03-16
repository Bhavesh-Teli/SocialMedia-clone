import { TrendingUp, Home, Search, MessageCircle, Heart, PlusSquare, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
        <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];
const LeftSidebar = () => {
    const navigate = useNavigate();
    const logoutHandler = async () => {
       try {
            const response = await axios.get("http://localhost:5000/api/v1/users/logout",{withCredentials:true});
            if(response.data.success){
               navigate("/login");
               toast.success(response.data.message);
            }
       } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
       }
    }
    const sidebarHandler = (texttype) => {
        if(texttype === "Logout"){
            logoutHandler();
        }
    }
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col ">
            <h1 className="my-8 pl-3 text-2xl font-bold">Logo</h1>
            <div>
        {sidebarItems.map((item, index) => (
        <div onClick={()=>sidebarHandler(item.text)} key={index} className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer p-3 my-3">
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
        </div>
    </div>
    </div>
  );
};

export default LeftSidebar;

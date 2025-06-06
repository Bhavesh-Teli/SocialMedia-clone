import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/users/suggested', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
                console.log("suggested users",res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
};
export default useGetSuggestedUsers;
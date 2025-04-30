import axios from "axios"
import { useEffect ,React} from "react"
import { endpoints } from "../services/apis"
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/user/userSlice";

export const useGetOtherUsers=()=>{
    const BASE_URL=endpoints.BASE_URL;
    const dispatch= useDispatch();
    useEffect(()=>{
        const fetOtherUser= async()=>{
            try {
                console.log("1 in other user")

                axios.defaults.withCredentials=true
                const res= await axios.get(`${BASE_URL}/v1/user/`)
                console.log("other use in other user",res);
                dispatch(setOtherUsers(res.data))
                
            } catch (error) {
                console.log(error)
                
            }
        }
        fetOtherUser();
    },[])
}
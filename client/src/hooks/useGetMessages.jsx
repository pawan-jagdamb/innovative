import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from "../services/apis";
import { setMessages } from '../redux/user/messageSlice';

const useGetMessages = () => {
    const BASE_URL = endpoints.BASE_URL;
    const { selectedUser ,currentUser} = useSelector(store => store.user);
    const dispatch= useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log("1")
                console.log("Selected User:", selectedUser);

                if (!selectedUser?._id) return;
                console.log("selected UserId",selectedUser._id)
                console.log("2")
                const GET_MESSAGE = `${BASE_URL}/v1/message/${selectedUser._id}`;
                const params = {
                    senderId: currentUser._id,
                    receiverId: selectedUser._id,
                  };
                const response = await apiConnector("GET", GET_MESSAGE,null,null,params);

                console.log("Fetched Messages:", response);
                dispatch(setMessages(response.data))
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    return null; // ✅ You must return something (even null)
};

export default useGetMessages;

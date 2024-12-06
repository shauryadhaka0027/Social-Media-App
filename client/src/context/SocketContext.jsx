import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useZustand } from "../Zustand/useZustand";

// Socket Context to manage socket connection
export const SocketContext = createContext();


export const SocketContextProvider = ({ children }) => {
    const { userInformation } = useZustand();
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
  
    useEffect(() => {
      if (userInformation?._id) {
        // Initialize the socket connection
        const socketInstance = io("http://localhost:3000", {
          query: { userId: userInformation?._id },
        });
  
        setSocket(socketInstance);
  
        // Listen for online users
        socketInstance.on("getOnlineUsers", (users) => {
          console.log("Online users:", users);
          setOnlineUser(users);
        });
  
        // Cleanup on unmount
        return () => {
          socketInstance.close();
        };
      }
    }, [userInformation]);
  
    return (
      <SocketContext.Provider value={{ socket, onlineUser }}>
        {children}
      </SocketContext.Provider>
    );
  };
  
// import { useMutation } from "@tanstack/react-query";
// import React, { useState, useEffect } from "react";
// import smApi from "../../api/smApi";
// import { useZustand } from "../../Zustand/useZustand";
// import { useContext } from "react";
// import { SocketContext } from "../../context/SocketContext";
// import useListenNotifications from "../../Hooks/useListenNotifications";
// import {LoadingOutlined } from '@ant-design/icons'




// export const Friend = () => {
//   const [users, setUsers] = useState([]);
//   const { userInformation, setUserInformation } = useZustand();
//   const [followStatus, setFollowStatus] = useState({});
//   useListenNotifications();
//   const { socket } = useContext(SocketContext);

//   const { mutateAsync: fetchUserDetails, isLoading } = useMutation({
//     mutationFn: smApi.getUserDetails,
//   });

//   const addFollowing = useMutation({
//     mutationFn: smApi.addFollowing,
//   });

//   const userUnfollow = useMutation({
//     mutationFn: smApi.userUnfollow,
//   });

//   const getUserDetailsById = useMutation({
//     mutationFn: smApi.getUserDetailsById,
//   });

//   const getUserData = () => {
//     getUserDetailsById.mutate(
//       { _id: userInformation?._id },
//       {
//         onSuccess: (data) => {
//           localStorage.setItem("userData", JSON.stringify(data));
//           setUserInformation(data?.data);
//         },
//         onError: (error) => {
//           console.error("Error fetching user details:", error);
//         },
//       }
//     );
//   };

//   const getUserDetailsFunc = async () => {
//     try {
//       if (userInformation?._id) {
//         const data = await fetchUserDetails({ userId: userInformation?._id });
//         setUsers(data?.data || []);
//         checkUserStatus(data?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const checkUserStatus = (fetchedUsers) => {
//     const newFollowStatus = {};
//     fetchedUsers.forEach((user) => {
//       newFollowStatus[user?._id] =
//         userInformation?.following?.includes(user?._id) || false;
//     });
//     setFollowStatus(newFollowStatus);
//   };

//   useEffect(() => {
//     if (userInformation?._id) {
//       getUserDetailsFunc();
//     }
//   }, [userInformation?._id]);

//   const handleFollowClick = async (userId) => {
//     const isCurrentlyFollowing = followStatus[userId];

//     if (isCurrentlyFollowing) {
//       userUnfollow.mutate(
//         { _id: userInformation?._id, userId: userId },
//         {
//           onSuccess: () => {
//             getUserData(); 
//             setFollowStatus((prevStatus) => ({
//               ...prevStatus,
//               [userId]: false,
//             }));
//           },
//           onError: (error) => {
//             console.error("Error unfollowing user:", error);
//           },
//         }
//       );
//     } else {
//       addFollowing.mutate(
//         { _id: userInformation?._id, userId },
//         {
//           onSuccess: () => {
//             if (socket) {
//               socket.emit("follow", {
//                 postUserId: userId,
//                 sender: userInformation?._id,
//               });
//             }
//             getUserData(); 
//             setFollowStatus((prevStatus) => ({
//               ...prevStatus,
//               [userId]: true, 
//             }));
//           },
//           onError: (error) => {
//             console.error("Error following user:", error);
//           },
//         }
//       );
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Friends</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         users.map((user) => (
//           <div
//             key={user._id}
//             className="flex items-center justify-between bg-white p-4 shadow-lg rounded-lg mb-4"
//           >
//             <div className="flex items-center gap-10 p-4">
//               <img
//                 src={user?.profilePicture}
//                 alt={`${user.username}'s Image`}
//                 className="w-12 h-12 rounded-full"
//               />
//               <p className="text-sm font-medium">{user?.username}</p>
//             </div>
//             <button
//               onClick={() => handleFollowClick(user._id)}
//               className={`px-4 py-2 text-sm rounded-lg ${
//                 followStatus[user._id]
//                   ? "bg-red-500 text-white"
//                   : "bg-blue-500 text-white"
//               }`}
//             >
//               {followStatus[user._id] ? "Unfollow" : "Follow"}
//               {(!followStatus[user._id] && addFollowing.isPending ) && <span><LoadingOutlined /></span> }
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };



import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import smApi from "../../api/smApi";
import { useZustand } from "../../Zustand/useZustand";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import useListenNotifications from "../../Hooks/useListenNotifications";
import { LoadingOutlined } from '@ant-design/icons';

export const Friend = () => {
  const [users, setUsers] = useState([]);
  const { userInformation, setUserInformation } = useZustand();
  const [followStatus, setFollowStatus] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({}); // Track loading state for each user
  useListenNotifications();
  const { socket } = useContext(SocketContext);

  const { mutateAsync: fetchUserDetails, isLoading } = useMutation({
    mutationFn: smApi.getUserDetails,
  });

  const addFollowing = useMutation({
    mutationFn: smApi.addFollowing,
  });

  const userUnfollow = useMutation({
    mutationFn: smApi.userUnfollow,
  });

  const getUserDetailsById = useMutation({
    mutationFn: smApi.getUserDetailsById,
  });

  const getUserData = () => {
    getUserDetailsById.mutate(
      { _id: userInformation?._id },
      {
        onSuccess: (data) => {
          localStorage.setItem("userData", JSON.stringify(data));
          setUserInformation(data?.data);
        },
        onError: (error) => {
          console.error("Error fetching user details:", error);
        },
      }
    );
  };

  const getUserDetailsFunc = async () => {
    try {
      if (userInformation?._id) {
        const data = await fetchUserDetails({ userId: userInformation?._id });
        setUsers(data?.data || []);
        checkUserStatus(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const checkUserStatus = (fetchedUsers) => {
    const newFollowStatus = {};
    fetchedUsers.forEach((user) => {
      newFollowStatus[user?._id] =
        userInformation?.following?.includes(user?._id) || false;
    });
    setFollowStatus(newFollowStatus);
  };

  useEffect(() => {
    if (userInformation?._id) {
      getUserDetailsFunc();
    }
  }, [userInformation?._id]);

  const handleFollowClick = async (userId) => {
    setLoadingUsers((prevState) => ({ ...prevState, [userId]: true })); // Set loading state for this user

    const isCurrentlyFollowing = followStatus[userId];

    if (isCurrentlyFollowing) {
      userUnfollow.mutate(
        { _id: userInformation?._id, userId: userId },
        {
          onSuccess: () => {
            getUserData();
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: false,
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); 
          },
          onError: (error) => {
            console.error("Error unfollowing user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); 
          },
        }
      );
    } else {
      addFollowing.mutate(
        { _id: userInformation?._id, userId },
        {
          onSuccess: () => {
            if (socket) {
              socket.emit("follow", {
                postUserId: userId,
                sender: userInformation?._id,
              });
            }
            getUserData();
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: true,
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); // Reset loading state
          },
          onError: (error) => {
            console.error("Error following user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); // Reset loading state
          },
        }
      );
    }
  };

  return (
    <div className="w-[25%] hidden md:block mx-auto bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white p-4 shadow-lg rounded-lg mb-4"
          >
            <div className="flex items-center gap-10 p-4">
              <img
                src={user?.profilePicture}
                alt={`${user.username}'s Image`}
                className="w-12 h-12 rounded-full"
              />
              <p className="text-sm font-medium">{user?.username}</p>
            </div>
            <button
              onClick={() => handleFollowClick(user._id)}
              className={`px-4 py-2 text-sm rounded-lg ${
                followStatus[user._id]
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {followStatus[user._id] ? "Unfollow" : "Follow"}
              {loadingUsers[user._id] && (
                <span><LoadingOutlined /></span> 
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );
};


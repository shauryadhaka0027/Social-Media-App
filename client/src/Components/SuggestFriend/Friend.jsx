import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import smApi from "../../api/smApi";
import { useZustand } from "../../Zustand/useZustand";

export const Friend = () => {
  const [users, setUsers] = useState([]);
  const { userInformation, setUserInformation } = useZustand();
  const [followStatus, setFollowStatus] = useState({});


  const { mutateAsync: fetchUserDetails, isLoading } = useMutation({
    mutationFn: smApi.getUserDetails,
  });

  const addFollowing = useMutation({
    mutationFn: smApi.addFollowing,
  });

  const userUnfollow = useMutation({
    mutationFn: smApi.userUnfollow
  })

  const getUserDetailsById = useMutation({
    mutationFn: smApi.getUserDetailsById,
  });

  const getUserData = () => {

    getUserDetailsById.mutate({ _id: userInformation?._id }, {
      onSuccess: (data) => {
        localStorage.setItem("userData", JSON.stringify(data))
        setUserInformation(data?.data)
        const storeData = localStorage.getItem("userData")
        if (storeData) {
          const userData = JSON.parse(storeData)
          setUserInformation(userData.data)
          
        }
      },
      onError: (error) => {
        console.error("Error fetching user details:", error);
      }
    })


  }

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
      newFollowStatus[user._id] = userInformation?.following?.includes(user._id) || false;
    });
    setFollowStatus(newFollowStatus);
  };

  useEffect(() => {
    if (userInformation?._id) {
      getUserDetailsFunc();
    }
  }, [userInformation?._id]);

  const handleFollowClick = (userId) => {
    const isCurrentlyFollowing = followStatus[userId];

    if (followStatus[userId]) {
      userUnfollow.mutate({ _id: userInformation?._id, userId: userId }, {
        onSuccess: (data) => {

          setFollowStatus((prevStatus) => ({
            ...prevStatus,
            [userId]: !isCurrentlyFollowing,
          }));
          localStorage.clear();
          getUserData()
          // getUserDetailsById.mutate({ _id: userInformation?._id }, {
          //   onSuccess: (data) => {
          //     localStorage.clear();
          //     localStorage.setItem("userData", JSON.stringify(data));
          //     const storeData = localStorage.getItem("userData")
          //     if (storeData) {
          //       const userData = JSON.parse(storeData)
          //       setUserInformation(userData?.data)

          //     }

          //   },
          // });
        }
      })
    } else {
      addFollowing.mutate(
        { _id: userInformation?._id, userId },
        {
          onSuccess: () => {

            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: !isCurrentlyFollowing,
            }));

            localStorage.clear();
            getUserData()
            // getUserDetailsById.mutate(
            //   { _id: userInformation?._id },
            //   {
            //     onSuccess: (data) => {
            //       localStorage.clear();
            //       localStorage.setItem("userData", JSON.stringify(data));

            //     },
            //   }
            // );
          },
        }
      );
    }

  };
  //  console.log("foo",followStatus)
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg">
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
              className={`px-4 py-2 text-sm rounded-lg ${followStatus[user._id] ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                }`}
            >
              {followStatus[user._id] ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

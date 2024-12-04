import React, { useEffect, useState } from "react";
import { useZustand } from "../../Zustand/useZustand";
import { UserForm } from "../PopUserForm/UserForm";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";
import { ProfileImageChange } from "../ProfileChangeImage/ProfileImageChange";

const UserCard = () => {
  const { userInformation, setUserInformation } = useZustand()
  const [isopen, setIsOpen] = useState(false)
  const [isclosed, setIsClosed] =useState(false)
  const getUserDetailsById = useMutation({
    mutationFn: smApi.getUserDetailsById
  })

  const userProfileUpdate = useMutation({
    mutationFn: smApi.updateUserProfile
  })
  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = () => {
    const storeData = localStorage.getItem("userData")
    if (storeData) {
      const userData = JSON.parse(storeData)
      getUserDetailsById.mutate({ _id: userData.data?._id }, {
        onSuccess: (data) => {
          setUserInformation(data?.data)

        },
        onError: (error) => {
          console.error("Error fetching user details:", error);
        }
      })

    }
  }


  const toggleForm = (data) => {

    setIsOpen(data)
  }
  const onSubmitFormData = (formData) => {
    console.log('onSubmitFormData', formData)
    userProfileUpdate.mutate({ ...formData, _id: userInformation?._id }, {
      onSuccess: (data) => {
        alert("Form submitted successfully!");
        getUserData()
        setIsOpen(false)
      }
    })
  }
  const profilePictureUpdate=(data)=>{
    if(data === 'done'){
      getUserData()
      setIsClosed(!isclosed)
    }
   
  }
  return (
    <div className="w-[20%] bg-white shadow-lg rounded-lg p-6 ">

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 cursor-pointer" onClick={()=>setIsClosed(!isclosed)}>
          <img
            src={userInformation?.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {isclosed && <ProfileImageChange data={isclosed}  id={userInformation?._id}  profileUpdate={profilePictureUpdate}/>}
        <h2 className="mt-4 text-lg font-semibold text-gray-800">{userInformation?.username}</h2>
        <p className="text-gray-500 text-sm text-center">{userInformation?.bio}</p>
        <p className="text-gray-400 text-lg  py-2 ">Followers  {userInformation?.followers?.length}</p>
        <p className="text-gray-400 text-lg">Following  {userInformation?.following?.length}</p>

      </div>


      <hr className="my-4" />

      <ul className="space-y-4">
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500"  >
          <i className="bx bx-user text-lg"></i>
            <span  onClick={() => setIsOpen(!isopen)}>Profile</span>
            {isopen && <> <UserForm data={isopen} userData={userInformation} toggleForm={toggleForm} onSubmitFormData={onSubmitFormData} /></>}
     
        </li>
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500">
          <i className="bx bx-briefcase text-lg"></i>
          <span>Password</span>
        </li>
        {/* <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500">
          <i className="bx bx-book text-lg"></i>
          <span>Profile</span>
        </li> */}
        <li className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-blue-500">
          <i className="bx bx-cog text-lg"></i>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  )

}
export default UserCard
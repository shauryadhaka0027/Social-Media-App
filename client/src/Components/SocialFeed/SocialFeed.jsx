import React, { useEffect, useState } from "react";
import { IoIosImage, IoIosVideocam, IoIosPin, IoIosHappy, IoMdMore } from "react-icons/io";
import { AiOutlineLike, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { useZustand } from "../../Zustand/useZustand";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";
import { IoSend } from "react-icons/io5";
import { Modal, Button, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { PopConfirm } from "../popConfirm/PopConfirm";


const SocialFeed = () => {
  const { userInformation } = useZustand();
  const [content, setContent] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null); // Tracks the active post for comments
  const [posts, setPosts] = useState([]);

  const userPost = useMutation({
    mutationFn: smApi.userPost,
  });
  const getUserPost = useMutation({
    mutationFn: smApi.getUserPost,
  });
  const getLikesPost = useMutation({
    mutationFn: smApi.getLikesPost,
  });
  const getCommentsPost = useMutation({
    mutationFn: smApi.getCommentsPost,
  });

  const getUserPostData = () => {
    getUserPost.mutateAsync({}, {
      onSuccess: (data) => {
        console.log("userData",data);
        const latestUpdate = data?.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(latestUpdate);
      },
    });
  };
  console.log("possst",posts)
  const onChangeValue = (e) => {
    const { value } = e.target;
    setContent(value);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
  
    if (!content.trim()) {
      return alert("Please enter some content!");
    }
  
    const formData = new FormData();
    formData.append("user", userInformation?._id);
    formData.append("content", content);
  
    if (profileImage) {
      formData.append("profilePicture", profileImage);
    }
  
    // Uncomment this once debugging is complete
    console.log("Data Object (for reference):", formData)
    userPost.mutateAsync( { user: userInformation?._id, content, profilePicture: profileImage }, {
      onSuccess: () => {
        alert("Form submitted successfully!");
        getUserPostData();
      },
      onError: (error) => {
        console.error("Error:", error);
        alert("Failed to submit the post. Please try again.");
      },
    });
  
    setContent("");
    setProfileImage(null); // Reset image
  };
  

  const onFeedLikes = (postId) => {
    getLikesPost.mutateAsync({ postId, userId: userInformation?._id }, {
      onSuccess: (data) => {
        notification.success({
          type: "success",
          message: data.msg,
        });
        getUserPostData();
      },
      onError: (err) => {
        notification.error({
          type: "error",
          message: err.response.data.msg,
        });
      },
    });
  };

  const toggleCommentBox = (postId) => {
    setActiveCommentPostId((prevPostId) => (prevPostId === postId ? null : postId));

  };

  const onSubmitComments = (e) => {
    e.preventDefault();
    const dataObj = {
      userId: userInformation?._id,
      content: content,
      postId: activeCommentPostId,
    };
    getCommentsPost.mutateAsync(dataObj, {
      onSuccess: (data) => {
        notification.success({
          type: "success",
          message: data.msg,
        });
        toggleCommentBox(null);
        setContent("")
        getUserPostData();
      },
    });
  };



  const handleDelete = () => {
    getUserPostData();
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log("fillllle",file);
    if (file) {
      setProfileImage(file);
    }
  };


  useEffect(() => {
    getUserPostData();
  }, []);



  return (
    <div className="w-[45%] mx-auto bg-gray-50 p-4">
      <div className="bg-white shadow-lg w-auto rounded-lg p-4 mb-6">
        <form onSubmit={onSubmitForm}>
          <div className="flex items-start gap-4">
            <img
              src={userInformation?.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-grow">
              <input
                type="text"
                placeholder="What's going on"
                name="content"
                value={content}
                onChange={onChangeValue}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex mx-4 items-center gap-4 text-gray-500">
              <label
                htmlFor="profilePicture"
              >
                <IoIosImage size={20} className="cursor-pointer hover:text-blue-500" />
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
          

              <IoIosHappy size={20} className="cursor-pointer hover:text-blue-500" />
            </div  >
            <button  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Post it
            </button  >
          </div>
        </form>
        {
            profileImage && (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile"
                className="w-full  object-cover"
              />
            )
          }
      </div>

      
          
      

      {posts.map((post) => (
        <div key={post._id} className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={post?.user?.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold">{post?.user?.username}</h4>
                <p className="text-xs text-gray-400">{post?.user?.bio}</p>
              </div>
            </div>
            {/* <IoMdMore size={20} onClick={()=>handleDelete(post?._id)} className="text-gray-500 cursor-pointer" /> */}
            <PopConfirm handleDelete={handleDelete} data={post} />
          </div>
          <p className="mt-4  px-4 py-2 -text-sm text-gray-600">{post.content}</p>
          {post?.image && <div>
             <img src={post?.image} alt="" />
            </div>}
          

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6 text-gray-500">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => onFeedLikes(post._id)}
              >
                <AiOutlineLike />
                <span className="text-xs">{post.likes.length}</span>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleCommentBox(post._id)}
              >
                <AiOutlineComment />
                <span className="text-xs">Comments</span>
              </div>
            </div>
          </div>

          {activeCommentPostId === post._id && (
            <div className="bg-white shadow-lg w-auto rounded-lg p-4 mt-4">
              <form onSubmit={onSubmitComments}>
                <div className="flex items-start gap-4">
                  <img
                    src={userInformation?.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      name="comment"
                      value={content}
                      onChange={onChangeValue}
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 text-black rounded-lg text-sm -mx-2 border-2 border-black">
                    <IoSend size={20} />
                  </button>
                </div>
              </form>

              <div>
                
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-4 mt-4">
                    
                  
                    <img
                      src={userInformation?.profilePicture}
                      
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold">{userInformation?.username}</h4>
                      <p className="text-xs text-gray-600">{comment?.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;

import toast, { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { API_DOMAIN, API_WEB_URL } from '../config';
import axios from 'axios';

const DashBoard = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("email");
  const userImg = localStorage.getItem("userImg");
  const [logOut, setLogOut] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(userImg);
  const [imageFile, setImageFile] = useState('');


  const closeModal = () => {
    setIsOpen(false);
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  }




  const saveAndClose = async () => {
    const formData = new FormData();
    formData.append('userType', userType);
    formData.append('userEmail', userEmail);
    formData.append('image', imageFile);

    try {
      const response = await axios.post(API_DOMAIN + '/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem("userImg", API_WEB_URL + response.data);
      toast.success('Changed Successfully!!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setIsOpen(false);
  };



  const clickProfileModal = async () => {
    setIsOpen(true);
  }



  // useEffect(() => {
  //   const fetchImage = async () => {
  //     try {
  //       const response = await axios.post(`${API_DOMAIN}/fetch-user-image`, {
  //         userType,
  //         userEmail,
  //       });

  //       setImage(API_WEB_URL + response.data.image);
  //     } catch (error) {
  //       sessionStorage.setItem('toastMessage', 'Invalid MeetingID!');
  //       navigate('/lobby');
  //     }
  //   }

  //   fetchImage();
  // }, [])




  const handleClick = () => {
    setLogOut(true)
    toast.success('You have been successfully logged out!');
    localStorage.clear();
    setTimeout(() => navigate('/'), 3000);
  };




  // const handleClick = () => localStorage.removeItem('token');
  return (
    <div>
      {/* lg screens dashboard */}
      <div className="hidden lg:block bg-purple-700 w-80 h-full pt-8 px-6 pb-4 text-white">
        <div>
          <div className="flex flex-row items-center">
            <img src={image} className="w-10 h-10 cursor-pointer rounded-full" alt="user" onClick={clickProfileModal} />
            <div className="pl-4">
              <div className='capitalize'>{userType}</div>
              <div className="font-extralight">Welcome, <span className='capitalize'>{userName}</span></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3 mt-4">
          <Link to={"/prayer"}>
            <div className="flex flex-row space-x-3 mt-3 cursor-pointer items-center">
              <img className="w-8" src="/Dashboard/praying.png" alt="" />
              <h6 className="">Prayers Request</h6>
            </div>
          </Link>
          <Link to={"/seeddonations"}>
            <div className="flex flex-row space-x-5 mt-1 cursor-pointer items-center">
              <img className="w-8" src="/Dashboard/donation.png" alt="" />
              <h6 className="">Donation</h6>
            </div>
          </Link>

          {userType !== "master" && (
            <Link to={"/sermons/downloads"}>
              <div className="flex flex-row space-x-5 mt-3 cursor-pointer items-center">
                <img
                  className="w-8"
                  src="/Dashboard/downloading.png"
                  alt=""
                />
                <h6 className="">Downloads</h6>
              </div>
            </Link>
          )}

          <Link to={"/appointment"}>
            <div className="flex flex-row space-x-5 mt-3 cursor-pointer items-center">
              <img
                className="w-8"
                src="/Dashboard/appointment.png"
                alt=""
              />
              <h6 className="">Appointment</h6>
            </div>
          </Link>
        </div>

        {userType == "master" && (
          <>
            <Link to={"/members"}>
              <div className="flex flex-row space-x-5 mt-3 cursor-pointer items-center">
                <img
                  className="w-8"
                  src="/Dashboard/users.png"
                  alt=""
                />
                <h6 className="">All Members</h6>
              </div>
            </Link>
            <Link to={"/leaders"}>
              <div className="flex flex-row space-x-5 mt-3 cursor-pointer items-center">
                <img
                  className="w-8"
                  src="/Dashboard/leaders.png"
                  alt=""
                />
                <h6 className="">All Leaders</h6>
              </div>
            </Link>
          </>
        )}

        <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
          {/* <div className="flex flex-row space-x-1 mt-5 py-2 ">
            <img
              src="/Dashboard/group.png"
              className="w-11 h-12 mt-2"
              alt="participants"
            />
            <div className="flex flex-col space-y-1">
              <h4 className="font-bold cursor-pointer">Participants</h4>
              <p>All Participants who are in live streaming</p>
            </div>
          </div> */}
        </div>


        {userType == "Admin" ? (
          <Link to={"/lobby"}>
            <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
              <div className="flex flex-row space-x-1 mt-5 py-2">
                <img
                  src="/Dashboard/livestreaming.png"
                  className="w-11 max-h-11 mt-2"
                  alt="participants"
                />
                <div className="flex flex-col px-2 space-y-1">
                  <h4 className="font-bold cursor-pointer">
                    Live Video Streaming
                  </h4>
                  <p>All Participants who are in live streaming</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Link to={"/streaming-records"}>
            <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
              <div className="flex flex-row space-x-1 mt-5 py-2">
                <img
                  src="/Dashboard/livestreaming.png"
                  className="w-11 max-h-11 mt-2"
                  alt="participants"
                />
                <div className="flex flex-col px-2 space-y-1">
                  <h4 className="font-bold cursor-pointer">
                    Join Live Streaming
                  </h4>
                  <p>Live Video streaming by your following Church</p>
                </div>
              </div>
            </div>
          </Link>
        )}


        <Link to={"/sermons"}>
          <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
            <div className="flex flex-row items-center space-x-1 mt-5 py-2">
              <img
                src="/Dashboard/speech.png"
                className="w-11 max-h-11 mt-2"
                alt="participants"
              />
              <div className="flex flex-col px-2 space-y-1">
                <h4 className="font-bold ">Sermons</h4>
                <p>All Participants who are in live streaming</p>
              </div>
            </div>
          </div>
        </Link>


        {userType !== "Member" && (
          <div className="">
            <Link to={"/church/form"}>
              <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
                <div className="flex flex-row items-center space-x-1 mt-5 py-2">
                  <img
                    src="/church.png"
                    className="w-11 max-h-11 mt-2"
                    alt="participants"
                  />
                  <div className="flex flex-col px-2 space-y-1">
                    <h4 className="font-bold ">Church</h4>
                    <p>All Participants who are in live streaming</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}


        {userType == "Admin" ? (
          <Link to={"/church-invitations"}>
            <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
              <div className="flex flex-row items-center space-x-1 mt-5 py-2">
                <img
                  src="/church.png"
                  className="w-11 max-h-11 mt-2"
                  alt="participants"
                />
                <div className="flex flex-col pl-2">
                  <h4 className="font-bold ">Church Invitations</h4>
                  <p>All Participants who are in live streaming</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          ""
        )}
        <div onClick={handleClick}>
          <div className="bg-purple-800 rounded-2xl px-2 cursor-pointer">
            <div className="flex flex-row items-center space-x-1 mt-5 py-2">
              <img
                src="/log-out.png"
                className="w-11 max-h-11 mt-2"
                alt="participants"
              />
              <div className="flex flex-col space-y-1">
                <h4 className="font-bold ">Log Out</h4>
                <p>All Participants who are in live streaming</p>
              </div>
            </div>
          </div>
        </div>
      </div>




      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Change Profile Picture</h2>

            {image && (
              <div className="mb-4">
                <img src={image} alt="User" className="w-32 h-32 rounded-full mx-auto" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4 p-2 border rounded-lg"
            />

            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveAndClose}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {logOut && <Toaster />}
      {/* lg screens dashboard */}
    </div>
  );
};

export default DashBoard;

import { Link } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN } from '../../config';
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
const api_domain = API_DOMAIN;


const StartStreaming = () => {
  const navigate = useNavigate();

  const createInstantMeeting = async () => {
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("email");

    try {
      const response = await axios.post(api_domain + '/create-instant-meeting', {
        userType,
        userName,
        userEmail,
      });
      navigate(`/start?meeting=${response.data.meetingurl}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };




  useEffect(() => {
    const message = sessionStorage.getItem('toastMessage');
    if (message) {
      toast.error(message);
      sessionStorage.removeItem('toastMessage');
    }

    const message2 = sessionStorage.getItem('toastSuccessMessage');
    if (message2) {
      toast.success(message2);
      sessionStorage.removeItem('toastSuccessMessage');
    }
  }, []);



  return (
    <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen h-screen  flex flex-col justify-between bg-slate-50 text-black">
        <div className="sm:w-full">
          <div className="spec_header">
            <div className="flex justify-around column px-12 items-center mb-1">

              <nav className="flex justify-between items-center bg-purple-700 p-4 rounded-lg text-white">
                <div className="grid grid-cols-5 gap-8 justify-center items-center">
                  <Link to="/lobby" className="hover:bg-gray-800 rounded-lg bg-gray-800 p-2 w-24 text-sm flex justify-center items-center flex-row">
                    <img src="/home_icon.png" alt="" className="h-12" />
                  </Link>
                  <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                    <img src="/live_streaming.png" alt="" className="h-12" />
                  </Link>
                  <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                    <img src="/participants.png" alt="" className="h-12" />
                  </Link>
                  <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                    <img src="/chatroom.png" alt="" className="h-12" />
                  </Link>
                  <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                    <img src="/end_call.png" alt="" className="h-12" />
                  </Link>
                </div>
              </nav>
            </div>
          </div>



          <div className="bg-slate-100 px-8 py-6 h-full">
            <h2 className="text-gray-700 mb-2 font-semibold text-2xl">Start a live Streaming</h2>
            <p className="text-gray-800">
              Starting a live stream lets you connect with your audience in real time, whether for entertainment, education, or business. With stable internet and good equipment, you can engage viewers instantly and build interaction.
            </p>


            <div className="grid grid-cols-2 justify-center align-center gap-8 mt-12 max-w-[700px] mx-auto">
              <div className="w-full">
                <div className="bg-purple-700 rounded-lg flex flex-col justify-center items-center w-full h-32 cursor-pointer" onClick={createInstantMeeting}>
                  <img src="/stream/new.png" alt="" className="h-12" />
                  <p className="text-white text-sm">Start Instant Meeting</p>
                </div>
              </div>

              <div className="w-full">
                <Link to={'/churchinvitation'} className="bg-purple-700 rounded-lg flex flex-col justify-center items-center w-full h-32">
                  <img src="/stream/join.png" alt="" className="h-12" />
                  <p className="text-white text-sm">Join Meeting</p>
                </Link>
              </div>

              <div className="w-full">
                <Link to={'/start'} className="bg-purple-700 rounded-lg flex flex-col justify-center items-center w-full h-32">
                  <img src="/stream/alarm.png" alt="" className="h-12" />
                  <p className="text-white text-sm">Share Screen</p>
                </Link>
              </div>

              <div className="w-full">
                <Link to={'/livestreaming'} className="bg-purple-700 rounded-lg flex flex-col justify-center items-center w-full h-32">
                  <img src="/stream/code.png" alt="" className="h-12" />
                  <p className="text-white text-sm">Schedule New Meeting</p>
                </Link>
              </div>
            </div>
          </div>


        </div>
      </div>

      <Toaster />
    </div >
  );
};

export default StartStreaming;

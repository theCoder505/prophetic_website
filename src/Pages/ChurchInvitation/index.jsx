import MenuBar from "../../Components/MenuBar";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import toast, { Toaster } from "react-hot-toast";

const ChurchInvitation = () => {
  const [churches, setChurches] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const api_domain = API_DOMAIN;
  const userType = localStorage.getItem("userType");
  const userEmail = localStorage.getItem("email");
  const [invitationMessages, setInvitationMessages] = useState({});
  const loggerID = localStorage.getItem("logger_id");

  useEffect(() => {
    axios
      .post(`${api_domain}/all-church-list`, {
        userEmail: userEmail,
        userType: userType,
      })
      .then((res) => {
        setChurches(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching churches:", error);
      });



    axios
      .post(`${api_domain}/fetch-leaders`, {
        userEmail: userEmail,
        userType: userType,
      })
      .then((res) => {
        setLeaders(res.data);
      })
      .catch((error) => {
        console.error("Error fetching churches:", error);
      });
  }, [userEmail, userType]);






  const handleInvite = (leader, churchId, churchImgPath) => {
    const message = invitationMessages[churchId];
    axios
      .post(`${API_DOMAIN}/send-stream-invitation`, {
        userType,
        userID: loggerID,
        receiverID: leader.id,
        churchImgPath,
        message: message, // Message specific to the church
      })
      .then(() => {
        toast.success("Invitation Sent!");
        setInvitationMessages((prevMessages) => ({
          ...prevMessages,
          [churchId]: "",
        }));
      })
      .catch((error) => {
        console.error("Error sending invitation:", error);
      });
  };



  return (
    <div className="h-full sm:flex sm:flex-row sm:space-x-5 bg-slate-50 text-black">
      <DashBoard />


      <div className="w-screen bg-slate-50 text-black">
        <div className="sm:w-full">
          <div className="spec_header">
            <div className="flex row space-x-2 ml-8 items-center">
              <AiOutlineMenu className="sm:hidden" />
            </div>
            <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
              <div className="hidden sm:block">
                <h6 className="link_text text-gray-300 font-semibold text-3xl">Partnership with other Churches</h6>
              </div>
            </div>
          </div>


          <div className="overflow-auto h-[85vh]">
            <div className="mt-4 px-4 h-full sm:h-0">

              {churches.length > 0 ? (
                churches
                  .filter((church) =>
                    leaders.some((leader) => leader.church_id == church.id)
                  )
                  .map((church) => {
                    const leader = leaders.find((leader) => leader.church_id === church.id);
                    return (
                      <div
                        className="border-purple-800 border-2 rounded-md p-5 mb-4"
                        key={church.id}
                      >
                        <h1 className="text-xl font-bold capitalize text-center text-slate-700">
                          {church.churchname}
                        </h1>
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-col w-44">
                            <img
                              src={`${API_WEB_URL}/storage/${church.church_img}`}
                              alt="Church"
                              className="w-full rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-extralight text-slate-800">
                              Preacher:
                              <span className="font-semibold text-black ml-2">
                                {church.added_by === 1 ? "Admin" : church.added_by}
                              </span>
                            </h3>

                            <h3 className="text-lg font-extralight text-slate-800">
                              Location:
                              <span className="font-light text-gray-600 capitalize ml-2">
                                {church.postalAddress}
                              </span>
                            </h3>

                            <input
                              type="text"
                              placeholder="Enter message"
                              value={invitationMessages[church.id] || ""}
                              onChange={(e) =>
                                setInvitationMessages({
                                  ...invitationMessages,
                                  [church.id]: e.target.value,
                                })
                              }
                              className="my-2 px-3 py-2 border-2 rounded w-full border-purple-800"
                            />
                          </div>
                          <div>
                            <button
                              onClick={() => handleInvite(leader, church.id, church.church_img)}
                              className="block text-center invite rounded-full bg-[#d8d8d8] hover:bg-purple-700 mt-2 mb-20 mx-auto px-2 py-2 w-32 text-gray-700 hover:text-white"
                            >
                              Invite
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                ""
              )}

            </div>
          </div>

          <MenuBar />
        </div>
      </div>



      <Toaster />
      <SideBoard />
    </div>
  );
};

export default ChurchInvitation;

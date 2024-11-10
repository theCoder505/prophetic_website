import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import MenuBar from "../../Components/MenuBar";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_DOMAIN, API_WEB_URL } from "../../config";
import toast, { Toaster } from "react-hot-toast";


const Partnership = () => {
    const [invitations, setInvitations] = useState([]);
    const api_domain = API_DOMAIN;
    const userType = localStorage.getItem("userType");
    const userEmail = localStorage.getItem("email");
    const loggerID = localStorage.getItem("logger_id");

    useEffect(() => {
        axios
            .post(`${api_domain}/fetch-all-invitations`, {
                userType: userType,
                loggerID,
            })
            .then((res) => {
                setInvitations(res.data);
            })
            .catch((error) => {
                console.error("Error fetching churches:", error);
            });
    }, [userEmail, userType]);



    const deleteInvitation = (invitationID) => {
        axios
            .post(`${api_domain}/delete-invitations`, {
                deletingID: invitationID
            })
            .then(() => {
                setInvitations(prevInvitations =>
                    prevInvitations.filter(invitation => invitation.id !== invitationID)
                );
                toast.success('Invitation Rejected!');
            })
            .catch((error) => {
                console.error("Error deleting invitation:", error);
                toast.error('Failed to reject invitation.');
            });
    }


    return (
        <div className="sm:flex sm:flex-row sm:space-x-5 bg-slate-50 text-black">
            <DashBoard />
            <div className="w-screen flex flex-col justify-between bg-white h-screen">
                <div className="lg:w-full">
                    <div className="spec_header">
                        <div className="flex row space-x-2 ml-8 items-center">
                            <AiOutlineMenu className="sm:hidden" />
                        </div>
                        <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
                            <div className="hidden sm:block">
                                <h6 className="link_text text-white">Partnership with other Churches</h6>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 mt-4 px-4 bg-slate-200 h-full sm:h-0">



                        <div className="invitation_container">
                            {invitations.length == 0 ? (
                                <div className="text-center py-4 text-gray-600 text-3xl font-semibold">
                                    No Invitations Yet!
                                </div>
                            ) : (
                                invitations.map((invitation, index) => (
                                    <div className="invitation_line" key={index}>
                                        <div className="bg-gray-300 rounded-lg p-6">
                                            <div className="flex gap-4">
                                                <img
                                                    src={`${API_WEB_URL}/storage/${invitation.church_img}`}
                                                    alt="Church"
                                                    className="w-40 rounded-md"
                                                />
                                                <div className="text-black">
                                                    Admin of
                                                    <span className="font-bold">“{invitation.churchname}”</span>
                                                    sent a link to join live streaming in the church. Click on the link to join...
                                                    <p className="text-[#7851A9]">
                                                        {invitation.message}
                                                    </p>

                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="time font-medium text-gray-500">
                                                            {invitation.created_at}
                                                        </div>
                                                        <div className="flex items-center gap-6 justify-end">
                                                            <button
                                                                className="text-black hover:text-gray-50 bg-gray-400 hover:bg-purple-800 px-6 py-1 text-center block rounded-full"
                                                                onClick={() => deleteInvitation(invitation.id)} // Call deleteInvitation with the invitation ID
                                                            >
                                                                Reject
                                                            </button>
                                                            <Link
                                                                className="text-gray-50 bg-purple-800 px-6 py-1 text-center block rounded-full"
                                                                to={`${invitation.message}`}
                                                            >
                                                                Accept
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>




                    </div>
                </div>
                <Toaster />
                <div className="lg:hidden">
                    <MenuBar />
                </div>
            </div>
            <SideBoard />
        </div>
    );
};

export default Partnership;

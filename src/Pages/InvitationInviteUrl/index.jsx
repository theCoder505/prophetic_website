// import { CLIENT_ID } from '../Config/Config';

// import { useState } from "react";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLocation } from 'react-router-dom';

// import MenuBar from "../../Components/MenuBar";


import DashBoard from "../../Components/DashBoard";

import SideBoard from "../../Components/SideBoard";


import MenuBar from "../../Components/MenuBar";
import { AiOutlineMenu } from "react-icons/ai";
// const baseUrl = window.location.origin;

// import { CLIENT_ID } from "../Config/Config";

const Partnership = () => {
    const CLIENT_ID = "ATSuisuq1XawDPi9DasmYnjD4fvQjgubnfcFxAe73tVdBWQAq264_jZKv00WYrQazSs4VKXFyLJCJpZR";

    const participants = Array(6).fill({
        imgSrc: "/users/richard_profile_img.png",
        micOffSrc: "/mic_off.png",
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const room = searchParams.get('room');



    return (
        <PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
            <div className="sm:flex sm:flex-row bg-slate-50 text-black">
                <DashBoard />
                <div className="w-screen flex flex-col justify-between bg-white ml-5">
                    <div className="lg:w-full bg-purple-700">
                        <div className="py-4">
                            <div className="flex row space-x-2 ml-8 items-center">
                                <AiOutlineMenu className="sm:hidden" />
                            </div>
                            <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex gap-6 items-center">
                                        <img src="/user_icon.png" alt="" className="h-10 w-10 rounded-full" />
                                        <div className="font-semibold text-white text-lg">Admin</div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <div className="rounded-full h-2 w-2 bg-green-500"></div>
                                        <div className="text-white text-sm">Live Streaming</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 pl-10">
                            <div className="room_part">
                                <div className="padri_stream relative">
                                    {/* <video className="w-full h-auto" controls>
                                        <source src="/path_to_your_video.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video> */}

                                    <div className="flex justify-center gap-8 bg-[rgba(0,0,0,0.7)] py-4 absolute bottom-0 w-full">
                                        <img src="/mic_off.png" alt="" className="h-6 w-auto" />
                                        <img src="/cut_call.png" alt="" className="h-6 w-auto" />
                                        <img src="/list.png" alt="" className="h-6 w-auto" />
                                        <img src="/message.png" alt="" className="h-6 w-auto" />
                                        <img src="/share.png" alt="" className="h-6 w-auto" />
                                    </div>
                                </div>

                                {!room && (
                                    <div className="bg-purple-800 text-white text-center text-lg py-4 mx-auto max-w-2xl rounded-lg my-6">
                                        Note : “Church A has been Invited for live Streaming”
                                    </div>
                                )}


                                <div className="meeting_participants mt-10">
                                    <div className="text-white text-xl mb-6 font-semibold">
                                        Meeting Participants :
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        {participants.map((participant, index) => (
                                            <div key={index} className="participant relative group overflow-hidden">
                                                <img
                                                    src={participant.imgSrc}
                                                    alt="Participant"
                                                    className="participant_img w-full h-auto"
                                                />

                                                <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"></div>

                                                <img
                                                    src={participant.micOffSrc}
                                                    alt="Mic Off"
                                                    className="mic_img absolute inset-0 m-auto h-6 w-6 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className="h-20"></div>

                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <MenuBar />
                    </div>
                </div>
                <SideBoard />
            </div>
        </PayPalScriptProvider>
    );
};

export default Partnership;

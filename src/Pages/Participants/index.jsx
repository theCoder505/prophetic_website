import { Link } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
const StartStreaming = () => {
    const participants = Array(21).fill({
        imgSrc: "/users/henry.png",
        micOffSrc: "/mic_off.png",
    });

    return (
        <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
            <DashBoard />

            <div className="w-screen h-screen  flex flex-col justify-between bg-slate-50 text-black">
                <div className="sm:w-full">
                    <div className="spec_header">
                        <div className="flex justify-around column px-12 items-center mb-1">

                            <nav className="flex justify-between items-center bg-purple-700 p-4 rounded-lg text-white">
                                <div className="grid grid-cols-5 gap-8 justify-center items-center">
                                    <Link to="/lobby" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/home_icon.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/live_streaming.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/participants" className="hover:bg-gray-800 bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/participants.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/chatroom" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/chatroom.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/endmeeting" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/end_call.png" alt="" className="h-12" />
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>



                    <div className="bg-slate-100 px-8 py-6 h-full">
                        <div className="meeting_participants">
                            <div className="grid grid-cols-7 gap-4">
                                {participants.map((participant, index) => (
                                    <div key={index} className="rounded relative group overflow-hidden">
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
                    </div>


                </div>

            </div>

        </div >
    );
};

export default StartStreaming;

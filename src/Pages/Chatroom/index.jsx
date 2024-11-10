import { Link } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";


const StartStreaming = () => {

    const users = [
        { name: 'Admin', message: 'Hi! Hope you all are fine.', time: '09:12 AM', profilePic: '/users/admin.png', id: 1 },
        { name: 'User 1', message: 'Hi! Hope you all are fine.', time: '10:53 AM', profilePic: '/users/daniel.png', id: 2 },
        { name: 'User 2', message: 'Hi! Hope you all are fine.', time: '10:50 AM', profilePic: '/users/daniel.png', id: 3 },
        { name: 'User 3', message: 'Hi! Hope you all are fine.', time: '12:16 AM', profilePic: '/users/daniel.png', id: 4 },
        { name: 'User 4', message: 'Hi! Hope you all are fine.', time: '11:43 AM', profilePic: '/users/daniel.png', id: 5 },
    ];



    return (
        <div className="lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
            <DashBoard />

            <div className="w-screen flex flex-col justify-between bg-slate-50 text-black">
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
                                    <Link to="/participants" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/participants.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/chatroom" className="hover:bg-gray-800 bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/chatroom.png" alt="" className="h-12" />
                                    </Link>
                                    <Link to="/endmeeting" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                        <img src="/end_call.png" alt="" className="h-12" />
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>



                    <div className="bg-purple-700 flex gap-4 border-t-2 border-teal-100">
                        <div className="w-2/3 px-8 py-6">
                            <div className="flex row space-x-20 pt-2 pr-10 w-30 pb-1 font-roboto-slab mb-2">
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

                            <img src="/users/speaker_on_mic.png" alt="" className="w-full" />



                            <div className="flex gap-8 mt-6">
                                <div className="bg-purple-800 flex justify-between text-white py-4 w-full rounded-lg text-center border border-gray-400 px-6">
                                    <div>Meeting ID: </div>
                                    <div>Abcd12345fgh 1234 5678</div>
                                </div>
                                <div className="bg-purple-800 flex justify-between text-white py-4 w-full rounded-lg text-center border border-gray-400 px-6">
                                    <div>End: </div>
                                    <div>08:00 AM</div>
                                </div>
                            </div>


                            <h2 className="text-gray-50 mb-2 mt-6 font-semibold text-lg">Allow Participant to:</h2>
                            <div className="flex gap-4 text-white">
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" className="w-4 h-4 bg-transparent" name="mic_on" id="mic_on" />
                                    <label className="cursor-pointer" htmlFor="mic_on">Mic On</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" className="w-4 h-4 bg-transparent" name="mic_off" id="mic_off" />
                                    <label className="cursor-pointer" htmlFor="mic_off">Mic Off</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" className="w-4 h-4 bg-transparent" name="camera_on" id="camera_on" />
                                    <label className="cursor-pointer" htmlFor="camera_on">Camera On</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="checkbox" className="w-4 h-4 bg-transparent" name="camera_off" id="camera_off" />
                                    <label className="cursor-pointer" htmlFor="camera_off">Camera Off</label>
                                </div>
                            </div>



                            <div className="flex justify-between px-6 rounded-md gap-8 bg-[rgba(0,0,0,0.7)] py-6 w-full mt-6">
                                <img src="/mic_off.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/message.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/list.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/rss_feed.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/share.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/cut_call.png" alt="" className="cursor-pointer h-6 w-auto" />
                            </div>

                        </div>


                        <div className="w-1/3 bg-purple-800">



                            <div className="bg-purple-800 text-white">

                                <div className="flex justify-between items-center border-b-2 border-teal-100 px-6 py-4">
                                    <div className="text-md font-semibold">Chat Room</div>
                                    <div className="flex gap-2 items-center">
                                        <input type="checkbox" className="w-4 h-4 bg-transparent" name="allow_participant" id="allow_participant" />
                                        <label className="cursor-pointer" htmlFor="allow_participant">Allow Participant</label>
                                    </div>
                                </div>


                                <div className="chat_board px-6">

                                    <div className="mt-4 space-y-4">
                                        {users.map((user) => (
                                            <div key={user.id} className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                                    {user.profilePic ? (
                                                        <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-400" />
                                                    )}
                                                </div>
                                                <div className="ml-4 message_right">
                                                    <div className="flex justify-between text-xs text-gray-300">
                                                        {user.name} <span className="ml-2">{user.time}</span>
                                                    </div>
                                                    <div className="text-gray-100 text-sm">{user.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="Type your message here..."
                                            className="w-full py-2 px-6 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>


                </div>

            </div>
        </div >
    );
};

export default StartStreaming;

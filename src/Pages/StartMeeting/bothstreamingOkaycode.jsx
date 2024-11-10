import { useNavigate } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const api_domain = API_DOMAIN;

const StartMeeting = () => {
    const participants = Array(9).fill({
        imgSrc: "/users/henry.png",
        micOffSrc: "/mic_off.png",
    });

    const users = [
        { name: 'Admin', message: 'Hi! Hope you all are fine.', time: '09:12 AM', profilePic: '/users/admin.png', id: 1 },
        { name: 'User 1', message: 'Hi! Hope you all are fine.', time: '10:53 AM', profilePic: '/users/daniel.png', id: 2 },
        { name: 'User 2', message: 'Hi! Hope you all are fine.', time: '10:50 AM', profilePic: '/users/daniel.png', id: 3 },
        { name: 'User 3', message: 'Hi! Hope you all are fine.', time: '12:16 AM', profilePic: '/users/daniel.png', id: 4 },
        { name: 'User 4', message: 'Hi! Hope you all are fine.', time: '11:43 AM', profilePic: '/users/daniel.png', id: 5 },
    ];


    const queryParams = new URLSearchParams(location.search);
    const meetingId = queryParams.get('meeting');
    const [meetingTime, setMeetingTime] = useState(null);
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("email");
    const [image, setImage] = useState('');




    useEffect(() => {
        const fetchMeeting = async () => {
            if (meetingId) {
                try {
                    const response = await axios.get(`${api_domain}/fetch-meeting`, {
                        params: { meetingid: meetingId },
                    });
                    setMeetingTime(response.data.data.ending_time);
                    const meetingDate = new Date(response.data.data.meeting_date).toISOString().split('T')[0];
                    const todayDate = new Date().toISOString().split('T')[0];

                    //check if meeting is not for today
                    if (meetingDate !== todayDate) {
                        if (response.data.data.status == 'pending') {
                            sessionStorage.setItem('toastMessage', 'Meeting Date: ' + meetingDate);
                            window.history.back();
                        }
                    } else {
                        //check if schedule meeting or instant
                        if (response.data.data.status == 'pending') {
                            const starting_time = new Date(response.data.data.starting_time);
                            const ending_time = new Date(response.data.data.ending_time);
                            const current_time = new Date();
                            const formattedStartTime = starting_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                            const formattedEndTime = ending_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                            // check if the meeting time range is okay or not 
                            if (current_time >= starting_time && current_time <= ending_time) {
                                const userType = localStorage.getItem("userType");
                                const userName = localStorage.getItem("userName");
                                const userEmail = localStorage.getItem("email");
                                try {
                                    //update schedule meeting as started
                                    const response = await axios.post(API_DOMAIN + '/update-meeting-status', {
                                        meetingId,
                                        userType,
                                        userName,
                                        userEmail,
                                    });

                                    console.log(response.data);
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                sessionStorage.setItem('toastMessage', 'Meeting Range: ' + formattedStartTime + ' To ' + formattedEndTime);
                                window.history.back();
                            }
                        }

                    }
                } catch (error) {
                    sessionStorage.setItem('toastMessage', 'Invalid MeetingID!');
                    navigate('/lobby');
                }
            } else {
                sessionStorage.setItem('toastMessage', 'No MeetingID Found!');
                navigate('/lobby');
            }



            try {
                const response = await axios.post(`${API_DOMAIN}/fetch-user-image`, {
                    userType,
                    userEmail,
                });
                setImage(API_WEB_URL + response.data.image);
            } catch (error) {
                console.log(error);
            }
        };

        fetchMeeting();
    }, [meetingId]);







    const [activeTab, setActiveTab] = useState('streaming_tab');
    const showStreaming = () => {
        document.getElementById("streaming").classList.remove("hidden");
        document.getElementById("participants").classList.add("hidden");
        document.getElementById("meeting_participants").classList.remove("hidden");
        document.getElementById("chatroom").classList.add("hidden");
        setActiveTab('streaming_tab');
    }

    const showParticipants = () => {
        document.getElementById("streaming").classList.add("hidden");
        document.getElementById("participants").classList.remove("hidden");
        setActiveTab('participants_tab');
    }


    const showChatRoom = () => {
        document.getElementById("streaming").classList.remove("hidden");
        document.getElementById("participants").classList.add("hidden");
        document.getElementById("meeting_participants").classList.add("hidden");
        document.getElementById("chatroom").classList.remove("hidden");
        setActiveTab('chat_tab');
    }


    const endMeeting = async () => {
        const userEmail = localStorage.getItem("email");
        try {
            const response = await axios.post(API_DOMAIN + '/end-current-meeting', {
                meetingId,
                userEmail,
            });

            console.log(response.data);
            if (response.data == 1) {
                sessionStorage.setItem('toastSuccessMessage', 'Meeting Ended Successfully!');
                navigate('/lobby');
            }
        } catch (error) {
            console.log(error);

        }
    }




    //socket & WebRTC Codes
    const [streamText, setStreamText] = useState('Start Streaming!');
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ],
    };


    const startStreaming = async () => {
        setStreamText(`
            <div role="status" class="flex justify-center items-center">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        `);


        peerConnectionRef.current = new RTCPeerConnection(configuration);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;
            stream.getTracks().forEach((track) => {
                peerConnectionRef.current.addTrack(track, stream);
            });
            setIsStreaming(true);

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', offer);

            if (userType == 'Member') {
                setStreamText('Enjoy Streaming!');
            } else {
                setStreamText('Streaming From Webcam');
            }
        } catch (error) {
            console.error("Error accessing media devices.", error);
            alert(`Error accessing media devices: ${error.message}`);
            // Optionally, provide a more specific message for Chrome
            if (error.name === 'NotAllowedError') {
                alert('Permission to access camera and microphone denied. Please check your settings.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera or microphone found. Please check your device.');
            }
        }

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        socket.on('offer', async (offer) => {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('answer', answer);
        });

        socket.on('answer', (answer) => {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('candidate', (candidate) => {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
    };




    useEffect(() => {
        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('candidate');
        };
    }, []);



    const endStreaming = () => {
        if (isStreaming) {
            // Stop all tracks of the media stream
            const stream = localVideoRef.current.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Close the peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            // Reset state
            localVideoRef.current.srcObject = null; // Clear the local video
            remoteVideoRef.current.srcObject = null; // Clear the remote video
            setIsStreaming(false);
            setStreamText('Streaming Ended');
        }
    };








    return (
        <div className="lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black min-h-[100vh]">
            <DashBoard />

            <div className="w-screen flex flex-col justify-between bg-slate-50 text-black">
                <div className="sm:w-full bg-purple-700 h-full">
                    {userType === 'Admin' && (
                        <div className="spec_header">
                            <div className="flex justify-around column px-12 items-center mb-1">

                                <nav className="flex justify-between items-center bg-purple-700 p-4 rounded-lg text-white">
                                    <div className="grid grid-cols-5 gap-8 justify-center items-center">
                                        <a target="_blank" href="/lobby" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                            <img src="/home_icon.png" alt="" className="h-12" />
                                        </a>


                                        <div className={`hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row cursor-pointer streaming_tab ${activeTab === 'streaming_tab' ? 'bg-gray-800' : ''}`} onClick={showStreaming}>
                                            <img src="/live_streaming.png" alt="" className="h-12" />
                                        </div>


                                        <div className={`hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row cursor-pointer participants_tab ${activeTab === 'participants_tab' ? 'bg-gray-800' : ''}`} onClick={showParticipants}>
                                            <img src="/participants.png" alt="" className="h-12" />
                                        </div>


                                        <div className={`hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row cursor-pointer chat_tab ${activeTab === 'chat_tab' ? 'bg-gray-800' : ''}`} onClick={showChatRoom}>
                                            <img src="/chatroom.png" alt="" className="h-12" />
                                        </div>


                                        <div className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row cursor-pointer" onClick={endMeeting}>
                                            <img src="/end_call.png" alt="" className="h-12" />
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    )}

                    <div id="streaming" className="bg-purple-700 flex gap-4 border-t-2 border-teal-100 px-8 py-6">
                        <div className={userType === 'Admin' ? 'w-2/3' : 'w-full'}>
                            <div className="flex row space-x-20 pt-2 pr-10 w-30 pb-1 font-roboto-slab mb-2">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex gap-6 items-center">
                                        <img src={image} alt="" className="h-10 w-10 rounded-full" />
                                        <div className="font-semibold text-white text-lg">{userName}</div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <div className="rounded-full h-2 w-2 bg-green-500"></div>
                                        <div className="text-white text-sm">Live Streaming</div>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <div className="mt-4">
                                    <video ref={localVideoRef} autoPlay playsInline muted
                                        style={{ backgroundImage: `url('${image}')` }}
                                        className={`w-full rounded-xl shadow-purple-900 shadow-lg bg-purple-800 extraCss ${userType == 'Member' ? 'hidden' : ''}`}
                                        id="stream_video" />
                                </div>
                            </div>





                            <h2 className={`text-gray-300 text-center text-3xl mb-4 ${userType == 'Admin' ? 'hidden' : ''}`} >Enjoy Streaming!</h2>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className={`h-[70vh] mx-auto ${userType == 'Admin' ? 'hidden' : ''} rounded-xl`}
                                style={{ display: isStreaming ? '' : 'none' }}
                            />



                            <button onClick={startStreaming} className="mt-4 p-3 bg-slate-900 text-white min-w-full text-lg flex justify-center items-center rounded-xl">
                                <span dangerouslySetInnerHTML={{ __html: streamText }} />
                            </button>


                            <div className="flex gap-8 mt-6">
                                <div className="bg-purple-800 flex justify-between text-white py-4 w-full rounded-lg text-center border border-gray-400 px-6">
                                    <div>Meeting ID: </div>
                                    <div>{meetingId}</div>
                                </div>
                                <div className="bg-purple-800 flex justify-between text-white py-4 w-full rounded-lg text-center border border-gray-400 px-6">
                                    <div>End: </div>
                                    <div>{new Date(meetingTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                                </div>
                            </div>


                            {userType === 'Admin' && (
                                <>
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
                                </>
                            )}


                            <div className="flex justify-between px-6 rounded-md gap-8 bg-[rgba(0,0,0,0.7)] py-6 w-full mt-6">
                                <img src="/mic_off.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/message.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/list.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/rss_feed.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/share.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/cut_call.png" alt="" className="cursor-pointer h-6 w-auto" onClick={endStreaming} />
                            </div>





                        </div>

                        {userType === 'Admin' && (
                            <div className="w-1/3">
                                <div id="meeting_participants">
                                    <div className="text-white">
                                        <div className="flex justify-between items-center px-6 py-4">
                                            <div className="text-md font-semibold">Meeting Participants: </div>
                                            <div className="text-white cursor-pointer" onClick={showParticipants}>See all</div>
                                        </div>

                                        <div className="meeting_participants">
                                            <div className="grid grid-cols-3 gap-4">
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



                                        <div className="mt-8 bg-purple-800 text-white p-4 rounded-lg shadow-md">
                                            <div className="flex items-center justify-center mt-5 mb-8">
                                                <a href="/churchinvitation" target="_blank"
                                                    className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                                                    <span className="text-black text-3xl font-bold">+</span>
                                                </a>
                                            </div>
                                            <div className="text-lg font-semibold text-center my-2">Partnership with other Churches</div>
                                            <p className="mt-2 text-gray-200 text-lg px-6 h-40">
                                                Invites other Churches to minister <br /> in live streaming with audience.
                                            </p>
                                        </div>

                                    </div>
                                </div>


                                <div id="chatroom" className="hidden">
                                    <div className="bg-purple-800 text-white pb-10">

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
                        )}
                    </div>



                    <div id="participants" className="bg-slate-100 px-8 py-6 h-full hidden">
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

export default StartMeeting;

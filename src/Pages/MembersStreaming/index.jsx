import { useNavigate } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import { Peer } from 'peerjs';
import io from 'socket.io-client';

const api_domain = API_DOMAIN;


const MembersStreaming = () => {
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
                            if (!(current_time >= starting_time && current_time <= ending_time)) {
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




    // socket & WebRTC Codes
    const [answers, setAnswers] = useState([]);
    const videoRef = useRef(null); 
    const peerConnectionRef = useRef(null); 

    useEffect(() => {
        const socket = io('http://localhost:5000'); 

        socket.on('offer', async (data) => {
            console.log(`Offer received:`, data);
            setAnswers((prevAnswers) => [...prevAnswers, data]);
            const configuration = {
                initiator: true,
                trickle: false,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }, 
                        { urls: 'stun:stun1.l.google.com:19302' }, 
                        { urls: 'stun:stun2.l.google.com:19302' } 
                    ]
                }
            };

            
            peerConnectionRef.current = new RTCPeerConnection(configuration.config);
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));

            
            peerConnectionRef.current.ontrack = (event) => {
                const [stream] = event.streams; 
                videoRef.current.srcObject = stream; 
                console.log("Remote stream received:", stream.getVideoTracks()[0]);
                console.log(videoRef);
            };

            
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            
            socket.emit('answer', {
                answer: peerConnectionRef.current.localDescription
            });
        });

        // return () => {
        //     socket.disconnect(); 
        // };
    }, []);



    return (
        <div className="lg:flex lg:flex-row bg-slate-50 text-black">
            <DashBoard />

            <div className="w-screen flex flex-col justify-between bg-slate-50 text-black">
                <div className="sm:w-full bg-purple-700 h-full">



                    <div id="streaming" className="bg-purple-700 flex gap-4 px-8 py-6">
                        <div className="w-full">
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

                            {/* <ul>
                                {answers.map((answer, index) => (
                                    <li key={index}>{JSON.stringify(answer)}</li>
                                ))}
                            </ul> */}

                            <video ref={videoRef} autoPlay playsInline className="bg-purple-900 shadow shadow-purple-900 w-full rounded-xl max-h-80" />


                            {/* <img src="/users/speaker_on_mic.png" alt="" className="w-full" /> */}
                            {/* {peers.map(peer => (
                                <video key={peer.id} ref={el => (videoRefs.current[peer.id] = el)} autoPlay />
                            ))} */}

                            {/* <div>
                                {peers.map(peer => (
                                    <video
                                        key={peer.id}
                                        ref={el => (videoRefs.current[peer._peerId] = el)}
                                        autoPlay
                                        playsInline
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                ))}
                            </div> */}


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

                            <div className="flex justify-between px-6 rounded-md gap-8 bg-[rgba(0,0,0,0.7)] py-6 w-full mt-6">
                                <img src="/mic_off.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/message.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/list.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/rss_feed.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/share.png" alt="" className="cursor-pointer h-6 w-auto" />
                                <img src="/cut_call.png" alt="" className="cursor-pointer h-6 w-auto" />
                            </div>

                        </div>

                    </div>
                </div>

            </div>


        </div >
    );
};

export default MembersStreaming;

import { Link, useNavigate } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
// import SideBoard from "../../Components/SideBoard";
import MenuBar from "../../Components/MenuBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_DOMAIN } from "../../config";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";



const StartStreaming = () => {
    const navigate = useNavigate();
    const [showView, setShowView] = useState(false);
    const [meetingID, setMeetingID] = useState('');

    const [startDate, setStartDate] = useState('');
    const [formattedStartDate, setFormattedStartDate] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [startingTime, setStartingTime] = useState('11:00 AM');
    const [endTime, setEndTime] = useState('12:00 PM');
    const formatDateForDisplay = (date) => dayjs(date).format("DD MMM, YYYY");
    const formatDateForInput = (date) => dayjs(date).format("YYYY-MM-DD");
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("email");
    const loggerID = localStorage.getItem("logger_id");

    const [meetings, setMeetings] = useState([]);



    const copyTextFunc = () => {
        navigator.clipboard.writeText(meetingLink)
            .then(() => {
                toast.success('Link Copied!!');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };





    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await axios.post(API_DOMAIN + '/check-last-meeting-status', {
                    userType,
                    userName,
                    userEmail,
                });

                if (response.data != 0) {
                    setShowView(false);
                    navigate(`/start?meeting=${response.data.MeetingID}`);
                } else {
                    setShowView(true);
                    const randomLetters = () => Array(6).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
                    const randomNumbers = () => Math.floor(100000 + Math.random() * 900000);
                    const newMeetingID = `Prophetic_${randomLetters()}_${randomNumbers()}`;
                    setMeetingID(newMeetingID);
                    setMeetingLink(window.location.origin + "/start?meeting=" + newMeetingID);
                }

                const defaultDate = new Date();
                setStartDate(formatDateForInput(defaultDate));
                setFormattedStartDate(formatDateForDisplay(defaultDate));
            } catch (error) {
                console.log(error);
            }





            try {
                const response = await axios.post(API_DOMAIN + '/fetch-all-schedules', {
                    userType,
                    userName,
                    userEmail,
                });

                setMeetings(response.data);
            } catch (error) {
                console.log(error);
            }


            const message = sessionStorage.getItem('toastMessage');
            if (message) {
                toast.error(message);
                sessionStorage.removeItem('toastMessage');
            }

        };

        fetchMeeting();
    }, []);


    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setStartDate(e.target.value);
        setFormattedStartDate(formatDateForDisplay(newDate));
    };



    const endTimeSetting = (startTime) => {
        const [hour, minute] = startTime.split(":");
        let date = new Date();
        date.setHours(parseInt(hour));
        date.setMinutes(parseInt(minute));

        date.setHours(date.getHours() + 1);
        const endHour = date.getHours();
        const endMinute = date.getMinutes().toString().padStart(2, "0");
        const amPm = endHour >= 12 ? "PM" : "AM";

        const formattedEndHour = endHour % 12 || 12;

        const formattedTime = `${formattedEndHour}:${endMinute} ${amPm}`;
        setEndTime(formattedTime);
        setStartingTime(startTime);
    };


    const scheduleMeeting = async () => {
        const userType = localStorage.getItem("userType");
        const userName = localStorage.getItem("userName");
        const userEmail = localStorage.getItem("email");
        try {
            const response = await axios.post(API_DOMAIN + '/schedule-new-meeting', {
                meetingID,
                userType,
                userName,
                userEmail,
                startDate,
                startingTime,
                endTime
            });

            console.log(response.data);
            if (response.data == 'success') {
                toast.success('Meeting Created Successfully!!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error('Coud not create!Try later!');
            }
        } catch (error) {
            console.log(error);
        }
    }



    //table custom colors
    const handleDelete = async (meetingID) => {
        try {
            const response = await axios.post(API_DOMAIN + '/delete-meeting-schedule', {
                meetingID,
                userType: userType,    // Make sure userType is defined
                loggerID: loggerID      // Make sure loggerID is defined
            });

            if (response.status === 200) {
                toast.success("Meeting deleted successfully");
                console.log('Meeting deleted successfully');

                // Remove the deleted meeting from the state
                setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.MeetingID !== meetingID));
            } else {
                console.error('Failed to delete meeting');
            }
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: (row, index) => index + 1,
            sortable: true,
            center: true,
        },
        {
            name: 'Meeting ID',
            selector: row => row.MeetingID,
            sortable: true,
            center: true,
        },
        {
            name: 'Meeting Date',
            selector: row =>
                new Date(row.meeting_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
            sortable: true,
            center: true,
        },
        {
            name: 'Time',
            selector: row =>
                `${new Date(row.starting_time).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })} - ${new Date(row.ending_time).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })}`,
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            cell: row => {
                return row.status === 'pending' ? (
                    <Link to={`/start?meeting=${row.MeetingID}`} className="bg-sky-800 text-white w-20 text-center py-2 rounded-lg capitalize text-sm mx-auto my-2 block">
                        Start
                    </Link>
                ) : row.status === 'ended' ? (
                    <div className="bg-red-600 text-white w-20 text-center py-2 rounded-lg capitalize text-sm mx-auto my-2 cursor-not-allowed">
                        Ended
                    </div>
                ) : (
                    <div className="bg-gray-400 text-green-600 w-20 text-center py-2 rounded-sm capitalize text-sm mx-auto my-2 cursor-not-allowed">
                        Ongoing
                    </div>
                );
            },
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => handleDelete(row.MeetingID)}
                    className="bg-red-500 text-white w-20 text-center py-2 rounded-lg capitalize text-sm mx-auto my-2 block"
                >
                    Delete
                </button>
            ),
            center: true,
        },
    ];


    //table custom colors
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#1e293b',
                color: 'white',
                padding: '20px',
                fontSize: '1rem'
            },
        },
        rows: {
            style: {
                backgroundColor: '#4d2d75!important',
                color: 'white!important',
                borderBottom: '0.25px solid white !important',
            },
        },
    };






    if (!showView) {
        return null;
    } else {
        return (
            <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
                <DashBoard />

                <div className="w-screen h-full flex flex-col justify-between bg-slate-50 text-black">
                    <div className="sm:w-full">
                        <div className="spec_header">
                            <div className="flex justify-around column px-12 items-center mb-1">

                                <nav className="flex justify-between items-center bg-purple-700 p-4 rounded-lg text-white">
                                    <div className="grid grid-cols-5 gap-8 justify-center items-center">
                                        <Link to="/lobby" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                            <img src="/home_icon.png" alt="" className="h-12" />
                                        </Link>
                                        <Link to="/livestreaming" className="hover:bg-gray-800 bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row">
                                            <img src="/live_streaming.png" alt="" className="h-12" />
                                        </Link>
                                        <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row opacity-50 cursor-not-allowed pointer-events-none">
                                            <img src="/participants.png" alt="" className="h-12" />
                                        </Link>
                                        <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row opacity-50 cursor-not-allowed pointer-events-none">
                                            <img src="/chatroom.png" alt="" className="h-12" />
                                        </Link>
                                        <Link to="/livestreaming" className="hover:bg-gray-800 rounded-lg p-2 w-24 text-sm flex justify-center items-center flex-row opacity-50 cursor-not-allowed pointer-events-none">
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


                            <div className="my-8">
                                <h2 className="text-gray-700 mb-2 font-semibold text-lg">Meeting ID:</h2>
                                <div className="flex gap-8">
                                    <div className="bg-purple-700 text-white py-4 w-full rounded-lg text-center">
                                        {meetingID}
                                    </div>
                                    <div className="bg-purple-700 text-white py-4 w-full rounded-lg text-center cursor-pointer" onClick={scheduleMeeting}>
                                        Schedule Meeting
                                    </div>
                                </div>


                                <h2 className="text-gray-700 mt-4 mb-2 font-semibold text-lg">Meeting Schedule:</h2>
                                <div className="flex gap-8">
                                    <div className="bg-slate-50 py-2 w-full rounded-lg text-center border-2 border-gray-400">
                                        <div className="flex w-full justify-between items-center gap-2">
                                            <div className="border-r-2 px-4 border-gray-400 text-lg text-gray-400">Start</div>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={handleDateChange}
                                                className="text-lg px-4 text-gray-400 bg-slate-50 focus:outline-none"
                                            />
                                            <input
                                                type="time"
                                                onChange={(e) => endTimeSetting(e.target.value)}
                                                className="text-lg px-4 text-gray-400 bg-slate-50 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 py-2 w-full rounded-lg text-center border-2 border-gray-400">
                                        <div className="flex w-full justify-between items-center gap-2">
                                            <div className="border-r-2 px-4 border-gray-400 text-lg text-gray-400">End</div>
                                            <div className="text-lg px-4 text-gray-400">{formattedStartDate}</div>
                                            <div className="text-lg px-4 text-gray-400">{endTime}</div>
                                        </div>
                                    </div>
                                </div>



                                <h2 className="text-gray-700 mt-4 mb-2 font-semibold text-lg">Meeting Link:</h2>
                                <div className="flex gap-8">
                                    <div className="bg-slate-50 text-white py-2 w-full rounded-lg text-center border-2 border-gray-400">
                                        <div className="flex w-full justify-between items-center gap-2">
                                            <div className="border-r-2 px-4 border-gray-400 text-lg text-gray-400 w-full coping_text text-left">
                                                {meetingLink}
                                            </div>
                                            <div className="text-lg px-4 text-gray-400 w-18 cursor-pointer" onClick={copyTextFunc}>
                                                <img src="/copy_img.png" alt="" className="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <button className="w-full py-4 rounded-lg border-2 border-gray-400 bg-gray-200 text-gray-700 font-semibold text-lg mt-8 flex justify-center gap-8 cursor-pointer" onClick={copyTextFunc}>
                                    <img src="/share_link.png" alt="" className="h-8" />
                                    Share Link
                                </button>

                            </div>




                            <div id="allStreams" className="mt-20">
                                <h2 className="text-gray-700 mb-2 font-semibold text-3xl text-center">Scheduled Streams</h2>


                                <div className="overflow-x-auto mt-4">
                                    <DataTable
                                        columns={columns}
                                        data={meetings}
                                        pagination
                                        highlightOnHover
                                        striped
                                        dense
                                        responsive
                                        className="bg-slate-900 text-white"
                                        customStyles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="lg:hidden">
                        <MenuBar />
                    </div>
                </div>

                {/* <SideBoard /> */}
                <Toaster />
            </div>
        );
    }

};

export default StartStreaming;

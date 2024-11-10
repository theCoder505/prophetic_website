import { Link } from "react-router-dom";
import DashBoard from "../../Components/DashBoard";
// import SideBoard from "../../Components/SideBoard";
import MenuBar from "../../Components/MenuBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_DOMAIN } from "../../config";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";



const StreamingRecords = () => {
    const [schedules, setSchedules] = useState([]);


    useEffect(() => {
        const userType = localStorage.getItem("userType");
        const loggerID = localStorage.getItem("logger_id");
        const userEmail = localStorage.getItem("email");

        const fetchMeeting = async () => {
            try {
                const response = await axios.post(API_DOMAIN + '/fetch-all-streaming-records', {
                    userType,
                    loggerID,
                    userEmail,
                });

                setSchedules(response.data);
                console.log(response);
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



    // datatble data 
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







    return (
        <div className="min-h-screen h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
            <DashBoard />

            <div className="w-screen h-full flex flex-col justify-between bg-slate-50 text-black">
                <div className="sm:w-full">
                    <div className="spec_header">
                        <div className="flex justify-around column px-12 items-center mb-1">
                            <h2 className="text-gray-200 mb-2 font-semibold text-3xl">Streaming Records</h2>
                        </div>
                    </div>



                    <div className="bg-slate-100 px-8 py-6 h-full">
                        <h2 className="text-gray-700 mb-2 font-semibold text-2xl">Join a live Streaming</h2>
                        <p className="text-gray-800">
                            Join a live stream today to connect with your audience in real time! Whether you’re looking to entertain, educate, or grow your business, live streaming makes it easy to engage viewers instantly and boost interaction. With a stable internet connection and quality equipment, you’re all set to captivate your audience and make every moment count.
                        </p>





                        <div id="allStreams" className="mt-20">
                            <h2 className="text-gray-700 mb-2 font-semibold text-2xl text-center">All Streaming Records By Your Following Church</h2>


                            <div className="overflow-x-auto mt-4">
                                <DataTable
                                    columns={columns}
                                    data={schedules}
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

};

export default StreamingRecords;

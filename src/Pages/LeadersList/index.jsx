import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import MenuBar from "../../Components/MenuBar";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_DOMAIN } from "../../config";
import DataTable from "react-data-table-component";


const LeadersList = () => {
    const userType = localStorage.getItem("userType");
    const userEmail = localStorage.getItem("email");

    const [filterText, setFilterText] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        axios.post(
            `${API_DOMAIN}/all-leaders`,
            { userType, userEmail },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
            }
        )
            .then((response) => {

                if (userType === 'master') {
                    const filteredData = response.data.members.filter(
                        (member) =>
                            member.username.toLowerCase().includes(filterText.toLowerCase()) ||
                            member.email.toLowerCase().includes(filterText.toLowerCase())
                    );
                    setFilteredMembers(filteredData);
                } else {
                    setFilteredMembers(response.data.members);
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }, [userType, userEmail, filterText]);



    // Define columns for DataTable
    const columns = [
        { name: 'ID', selector: (row, index) => index + 1, sortable: true },
        { name: 'User Name', selector: (row) => row.username, sortable: true },
        { name: 'User Email', selector: (row) => row.email, sortable: true },
        { name: 'Assigned Church', selector: (row) => row.church_id, sortable: true },
        { name: 'Created At', selector: (row) => new Date(row.created_at).toLocaleDateString(), sortable: true },
    ];


    return (
        <div className="sm:flex sm:flex-row sm:space-x-5 bg-slate-50 text-black">
            <DashBoard />
            <div className="w-screen flex flex-col justify-between bg-white h-screen">
                <div className="lg:w-full">
                    <div className="spec_header">
                        <div className="flex row space-x-2 ml-8 items-center">
                            <AiOutlineMenu className="sm:hidden" />
                        </div>
                        <div className="font-roboto-slab pb-4">
                            <h6 className="text-gray-100 text-center text-3xl font-bold w-full">All Leaders List</h6>
                        </div>
                    </div>

                    <div className="mb-4 mt-4 px-4 bg-slate-200 h-full sm:h-0">

                        {userType === 'master' && (
                            <>
                                <div className="my-4">
                                    <input
                                        type="text"
                                        placeholder="Filter by Title, User Name, or Email"
                                        className="border border-gray-300 p-2 w-full"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                </div>

                                <DataTable
                                    columns={columns}
                                    data={filteredMembers}
                                    pagination
                                    highlightOnHover
                                    defaultSortFieldId={1}
                                />
                            </>
                        )}

                    </div>
                </div>
                <div className="lg:hidden">
                    <MenuBar />
                </div>
            </div>
            <SideBoard />
        </div>
    );
};

export default LeadersList;

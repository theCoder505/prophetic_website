import axios from "axios";
import { useEffect, useState } from "react";
import MenuBar from "../../Components/MenuBar";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import { Link } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineMenu } from "react-icons/ai";

const Churches = () => {
    const userType = localStorage.getItem("userType");
    const userEmail = localStorage.getItem("email");
    const [churches, setChurches] = useState([]);
    const api_domain = API_DOMAIN;
    const web_url = API_WEB_URL;
    const [btntext, setBtntext] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const filteredChurches = churches.filter((church) =>
        church.churchname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        church.postalAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        setIsLoading(true);
        setBtntext(`<div role="status" class="flex justify-center items-center mt-10">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>`);



        axios
            .post(api_domain + "/fetch-user-id", {
                userType: userType,
                userEmail: userEmail,
            })
            .then((response1) => {
                var userid = response1.data.id;
                axios
                    .get(api_domain + "/churches")
                    .then((response) => {
                        const allChurches = response.data;
                        let filteredChurches = [];
                        if (userType == "Admin") {
                            console.log(userid);

                            filteredChurches = allChurches.filter(church => church.added_by_uid == userid);
                        } else if (userType == "master") {
                            filteredChurches = allChurches;
                        }
                        setChurches(filteredChurches);

                        setIsLoading(false);
                        setBtntext('');
                    })
                    .catch((error) => {
                        console.error("An error occurred:", error);
                    });
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }, []);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };


    const deleteRow = (id) => {
        axios
            .post(
                api_domain + "/delete-church",
                {
                    deleting_id: id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    // Show success message
                    toast.success('Deleted Successfully!');

                    // Update the churches array, removing the deleted church
                    setChurches((prevChurches) => prevChurches.filter((church) => church.id !== id));
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    };


    return (
        <div className="h-full sm:flex sm:flex-row sm:space-x-5 bg-slate-100 text-black">
            <DashBoard />

            <div className="w-screen bg-slate-100 text-black ">
                <div className="sm:w-full">
                    <div className="spec_header">
                        <div className="flex justify-around column px-12 items-center mb-1">
                            <div className="sm:pr-10 flex flex-row items-center">
                                <AiOutlineMenu className="sm:hidden" />
                                <Link to="/church/form">
                                    <h5 className="hidden link_text sm:inline text-3xl sm:font-medium sm:text-xl ">
                                        Add Church
                                    </h5>
                                </Link>
                            </div>

                            <div>
                                <Link to={"/churches"}>
                                    <h5 className="text-white text-lg font-bold sm:font-medium sm:text-xl">
                                        All Churches
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-6 px-6">
                        <h1 className="text-center font-serif font-extrabold text-3xl uppercase text-gray-500 mb-2">
                            Your All Churches
                        </h1>


                        {isLoading ? (
                            <span dangerouslySetInnerHTML={{ __html: btntext }} />
                        ) : (
                            btntext
                        )}

                        {/* Search Input */}
                        <div id="table_div" className="overflow-auto pt-4">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search churches..."
                                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize float-right mb-4"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Table */}
                            <table className="min-w-full bg-white shadow-md rounded-lg mb-24 overflow-auto lg:overflow-hidden">
                                <thead>
                                    <tr className="bg-black text-white border-white border-b-2">
                                        <th className="py-3 px-4 font-light text-center border-2">
                                            Church
                                        </th>
                                        <th className="py-3 px-4 font-light text-center border-2">
                                            Name
                                        </th>
                                        <th className="py-3 px-4 font-light text-center border-2">
                                            Postal Address
                                        </th>
                                        <th className="py-3 px-4 font-light text-center border-2">
                                            Created At
                                        </th>
                                        <th className="py-3 px-4 font-light  text-right border-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-black text-center capitalize">
                                    {filteredChurches.map((church) => (
                                        <tr key={church.id}>
                                            <td className="p-2 border-2">
                                                <img src={`${web_url}/storage/${church.church_img}`} alt='Church' className="w-full rounded-md" />
                                            </td>
                                            <td className="py-3 px-4 border-2">{church.churchname}</td>
                                            <td className="py-3 px-4 border-2">{church.postalAddress}</td>
                                            <td className="py-3 px-4 border-2">
                                                {formatDate(church.created_at)}
                                            </td>
                                            <td className="py-3 px-4 border-2 text-center w-20">
                                                <span onClick={() => deleteRow(church.id)}>
                                                    <Delete className="text-red-500 cursor-pointer"></Delete>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Display a message if no churches match the search term */}
                                    {filteredChurches.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-3 px-4 text-center">
                                                No churches found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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

export default Churches;

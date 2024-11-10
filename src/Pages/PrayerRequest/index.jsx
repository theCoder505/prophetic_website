import axios from "axios";
import { useEffect, useState } from "react";
import MenuBar from "../../Components/MenuBar";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
// import Absent from "../Absent";
import { API_DOMAIN } from '../../config';
import toast, { Toaster } from 'react-hot-toast'
import DataTable from 'react-data-table-component';


const PrayerRequest = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const userType = localStorage.getItem("userType");
  const userEmail = localStorage.getItem("email");

  const api_domain = API_DOMAIN;
  const [btntext, setBtntext] = useState("Submit");
  const [isLoading, setIsLoading] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [filteredPrayers, setFilteredPrayers] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBtntext(`<div role="status" class="flex justify-center items-center">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>`);



    axios.post(
      api_domain + "/prayers/create",
      {
        username: userName,
        email: email,
        title: title,
        added_by: localStorage.getItem("email")
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((response) => {
        if (response.status === 201) {
          toast.success('Submitted Successfully!')
          setUserName("");
          setEmail("");
          setTitle("");
          setIsLoading(false);
          setBtntext('Submit');
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        toast.error('Could not submit form!')
        setIsLoading(false);
        setBtntext('Submit');
      });
  };



  useEffect(() => {
    axios.post(
      `${api_domain}/fetch-prayers`,
      { userType, userName, userEmail },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {

        // Filter data if userType is 'master'
        if (userType === 'master') {
          const filteredData = response.data.prayers.filter(
            (prayer) =>
              prayer.title.toLowerCase().includes(filterText.toLowerCase()) ||
              prayer.username.toLowerCase().includes(filterText.toLowerCase()) ||
              prayer.email.toLowerCase().includes(filterText.toLowerCase())
          );
          setFilteredPrayers(filteredData);
        } else {
          setFilteredPrayers(response.data.prayers);
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, [api_domain, userType, userName, userEmail, filterText]);

  // Define columns for DataTable
  const columns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true },
    { name: 'Title', selector: (row) => row.title, sortable: true },
    { name: 'User Name', selector: (row) => row.username, sortable: true },
    { name: 'User Email', selector: (row) => row.email, sortable: true },
    { name: 'Created At', selector: (row) => new Date(row.created_at).toLocaleDateString(), sortable: true },
  ];

  const token = localStorage.getItem("token");
  return (
    <>
      {token ? (
        <div className="min-h-screen h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
          {/* lg screens dashboard */}
          <DashBoard />

          {/* lg screens dashboard */}
          <div className="w-screen h-full  bg-slate-50 text-black">
            <div className="sm:w-full h-full flex flex-col justify-between">
              <div className="bg-white h-full">
                <div className="spec_header">
                  <div className="flex row space-x-2 ml-8 items-center">
                    <AiOutlineMenu className="sm:hidden" />
                    {/* <h2>Prayer Request</h2> */}
                  </div>
                  <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
                    <div>
                      <h6 className="link_text text-white font-bold">Prayer Form</h6>
                    </div>
                    <div>
                      <Link to={"/prayers"} className="font-bold link_text">Prayers</Link>
                    </div>
                    <div className="hidden sm:block">
                      <Link to={"/appointment"} className="font-bold link_text">Appointment</Link>
                    </div>
                  </div>
                </div>


                {userType !== 'master' && (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col px-8 py-4"
                  >
                    <label htmlFor="name" className="pb-1 text-gray-700 text-lg">
                      Name:
                    </label>
                    <input
                      type="text"
                      className="py-1 pl-2 mb-8 border border-black-500 rounded-lg"
                      placeholder="Name..."
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <label htmlFor="email" className="pb-1 text-gray-700 text-lg">
                      Email:
                    </label>
                    <input
                      type="text"
                      className="py-1 pl-2 mb-8 border border-black-500 rounded-lg"
                      placeholder="Your Email..."
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="prayerRequest" className="pb-1 text-gray-700 text-lg">
                      Prayer Request:
                    </label>
                    <textarea
                      id="prayerRequest"
                      cols="6"
                      rows="8"
                      onChange={(e) => setTitle(e.target.value)}
                      className="py-1 pl-2 mb-8 border border-black-500 rounded-lg"
                      placeholder="Enter your prayer request"
                    />
                    <button className="submit_btn">
                      {isLoading ? (
                        <span dangerouslySetInnerHTML={{ __html: btntext }} />
                      ) : (
                        btntext
                      )}
                    </button>
                  </form>
                )}


                {userType === 'master' && (
                  <>
                    <h2 className="text-center text-gray-500 text-2xl font-bold mt-10">
                      All Prayers
                    </h2>

                    {/* Search Bar */}
                    <div className="my-4">
                      <input
                        type="text"
                        placeholder="Filter by Title, User Name, or Email"
                        className="border border-gray-300 p-2 w-full"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>

                    {/* DataTable Component */}
                    <DataTable
                      columns={columns}
                      data={filteredPrayers}
                      pagination
                      highlightOnHover
                      defaultSortFieldId={1}
                    />
                  </>
                )}
              </div>
              <div className="lg:hidden">
                <MenuBar />
              </div>
            </div>
          </div>
          {/* lg screens dashboard */}

          <SideBoard />
          {/* lg screens dashboard */}
        </div>
      ) : (
        // <Absent />
        <div>Log Back in</div>
      )}

      <Toaster />
    </>
  );
};

export default PrayerRequest;

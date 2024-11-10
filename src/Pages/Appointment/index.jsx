import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuBar from "../../Components/MenuBar";
import axios from "axios";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { Link } from "react-router-dom";
import { API_DOMAIN } from '../../config';
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";

const Appointment = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [schedule, setSchedule] = useState(false);

  const api_domain = API_DOMAIN;
  const [btntext, setBtntext] = useState("Submit");
  const [isLoading, setIsLoading] = useState(false);


  const userType = localStorage.getItem("userType");
  const userEmail = localStorage.getItem("email");


  const [filterText, setFilterText] = useState('');
  const [filteredPrayers, setFilteredPrayers] = useState([]);

  const handleScheduleChange = (value) => {
    setSchedule(value);
  };

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


    axios
      .post(
        api_domain + "/appointments/create",
        {
          fullname: firstName + ' ' + lastName,
          email: email,
          phone_number: phoneNumber,
          reschedule: schedule,
          title: appointmentReason,
          trial_by: localStorage.getItem("email"),
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
          toast.success("Appointment Scheduled Successfully!");
          setIsLoading(false);
          setBtntext('Submit');
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhoneNumber("");
          setAppointmentReason("");
        }
      })
      .catch(() => {
        // console.error("An error occurred:", error);
        toast.error("Appointment Schedule Unsuccessful!");
        setIsLoading(false);
        setBtntext('Submit');
      });
  };





  useEffect(() => {
    axios.post(
      `${api_domain}/fetch-appointments`,
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
          const filteredData = response.data.prayers.filter(
            (appointment) =>
              appointment.fullname.toLowerCase().includes(filterText.toLowerCase()) ||
              appointment.email.toLowerCase().includes(filterText.toLowerCase()) ||
              appointment.phone_number.toLowerCase().includes(filterText.toLowerCase()) ||
              appointment.title.toLowerCase().includes(filterText.toLowerCase())
          );
          setFilteredPrayers(filteredData);
        } else {
          setFilteredPrayers(response.data.prayers);
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, [api_domain, userType, userEmail, filterText]);



  const columns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true },
    { name: 'Fullname', selector: (row) => row.fullname, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Phone Number', selector: (row) => row.phone_number, sortable: true },
    { name: 'Reason', selector: (row) => row.title, sortable: true },
    { name: 'Created At', selector: (row) => new Date(row.created_at).toLocaleDateString(), sortable: true },
  ];




  return (
    <div className="h-full flex flex-col justify-between lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen min-h-screen h-full flex flex-col justify-between bg-slate-50">
        <div className="lg:w-full bg-white h-full">
          <div className="spec_header">
            <div className="flex row space-x-2 ml-8 items-center">
              <AiOutlineMenu className="sm:hidden" />
            </div>
            <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
              <div>
                <Link to={"/prayer"} className="font-bold link_text">Prayer Form</Link>
              </div>
              <div>
                <Link to={"/prayers"} className="font-bold link_text">Prayers</Link>
              </div>
              <div className="hidden sm:block">
                <h6 className="link_text text-white font-bold">Appointment</h6>
              </div>
            </div>
          </div>





          {userType !== 'master' && (
            <form
              className="flex flex-col px-8 space-y-3 py-4"
              onSubmit={handleSubmit}
            >


              <div className="grid grid-cols-2">
                <div className="col-span-2 text-lg text-gray-600 mb-2" htmlFor="firstName">Full Name:</div>
                <div className="md:mr-3">
                  <div className="flex flex-row space-x-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="md:ml-3">
                  <div className="flex flex-row space-x-2">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-full"
                    />
                  </div>
                </div>


              </div>


              <div>
                <label className="text-lg text-gray-600 block mb-1 mt-3" htmlFor="email">Email:</label>
                <div className="flex  flex-row space-x-2">
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-lg text-gray-600 block mb-1 mt-3" htmlFor="phoneNumber">Phone Number:</label>
                <div className="flex  flex-row space-x-2">
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={phoneNumber}
                    maxLength={15}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-lg text-gray-600 block mb-1 mt-3" htmlFor="appointment">Reason For Appointment:</label>
                <div className="flex  flex-row space-x-2">
                  <textarea
                    name="appointment"
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    className=" pt-1 pr-4 pb-1 pl-2 border border-black-500 rounded-lg w-full"
                    id="appointment"
                    placeholder="Reason..."
                    cols={20}
                    rows={6}
                  ></textarea>
                </div>
              </div>
              <label htmlFor="schedule" className="text-gray-400 text-lg">
                Would you agree to reschedule the appointment, if needed?
              </label>
              <div className="mx-auto flex row space-x-20">
                <div className="flex row space-x-1 mb-4">
                  <input
                    type="radio"
                    checked={schedule}
                    onChange={() => handleScheduleChange(true)}
                  />
                  <h4>Yes</h4>
                </div>
                <div className="flex row space-x-1 mb-4">
                  <input
                    type="radio"
                    checked={!schedule}
                    onChange={() => handleScheduleChange(false)}
                  />
                  <h4>No</h4>
                </div>
              </div>
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
                All Appointments
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
      <Toaster />
      <SideBoard />
    </div>
  );
};

export default Appointment;

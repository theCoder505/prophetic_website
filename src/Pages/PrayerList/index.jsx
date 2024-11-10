import axios from "axios";
import { useEffect, useState } from "react";
import MenuBar from "../../Components/MenuBar";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { API_DOMAIN } from '../../config';

import { format } from "date-fns";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PrayerList = () => {
  const [prayers, setPrayers] = useState([]);
  const api_domain = API_DOMAIN;
  const [btntext, setBtntext] = useState("");
  const [isLoading, setIsLoading] = useState(false);


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
      .post(api_domain + "/prayers",
        {
          added_by: localStorage.getItem("email"),
          userType: localStorage.getItem("userType"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      ) // Assuming the URL is correct
      .then((response) => {
        console.log(response.data);
        setPrayers(response.data);
        setIsLoading(false);
        setBtntext('');
      })
      .catch(() => {
        // console.error("An error occurred:", error);
        setIsLoading(false);
        setBtntext('');
      });
  }, []);

  return (
    <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen h-screen flex flex-col justify-between bg-slate-50">
        <div className="sm:w-full bg-white h-full">
          <div className="spec_header">
            <div className="flex row space-x-2 ml-8 items-center">
              <AiOutlineMenu className="sm:hidden" />
            </div>
            <div className="flex row space-x-20 pl-10 pt-2 pr-10 w-30 pb-1 font-roboto-slab">
              <div>
                <Link to={"/prayer"} className="font-bold link_text">Prayer Form</Link>
              </div>
              <div>
                <h6 className="link_text text-white font-bold">Prayers</h6>
              </div>
              <div className="hidden sm:block">
                <Link to={"/appointment"} className="font-bold link_text">Appointment</Link>
              </div>
            </div>
          </div>
          <div className="mb-1 lg:h-0 px-8 py-4">
            {isLoading ? (
              <span dangerouslySetInnerHTML={{ __html: btntext }} />
            ) : (
              btntext
            )}

            {prayers.map((prayer) => {
              const formattedTime = format(new Date(prayer.created_at), "hh:mm a"); 
              const formattedDate = format(new Date(prayer.created_at), "dd-MM-yyyy"); 

              return (
                <div className="mb-4" key={prayer.id}>
                  <div className="flex space-x-20 mt-2 justify-between mb-2">
                    <div className="flex space-x-2">
                      <h4>{prayer.username} : </h4>
                      <h3 className="text-gray-400">{formattedTime}</h3>
                    </div>
                    <h3 className="text-gray-400">{formattedDate}</h3>
                  </div>
                  <div className="bg-[#f0f0f0] pt-1.5 px-3 pb-6 rounded-lg flex justify-between">
                    <p className="">{prayer.title}</p>
                    <MoreVertIcon className="three_dot" />
                  </div>
                </div>
              );
            })}
            {/* <div className="mb-1">
              <div className="flex space-x-18 mt-2">
                <div className="flex space-x-2 px-3 ">
                  <h4>Admin: </h4>
                  <h3>07:30Am</h3>
                </div>
                <h3>23-07-2023</h3>
              </div>
              <div className="mx-2 bg-slate-300 pt-1.5 px-3 pb-6 rounded-lg">
                <p className=" w-15">
                  Lorem Ipsum is simply dummy text of the printing and types
                  etting industry.
                </p>
              </div>
            </div> */}
          </div>
        </div>
        <MenuBar />
      </div>

      <SideBoard />
    </div>
  );
};

export default PrayerList;

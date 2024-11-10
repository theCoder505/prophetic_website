import axios from "axios";
import { useState } from "react";
import MenuBar from "../../Components/MenuBar";
import { AiOutlineMenu } from "react-icons/ai";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { API_DOMAIN } from '../../config';
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'

const PrayerRequest = () => {
  const userType = localStorage.getItem("userType");
  var userEmail = localStorage.getItem("email");
  const [churchName, setChurchName] = useState("");
  const [churchLocation, setChurchLocation] = useState("");
  const [btntext, setBtntext] = useState("Submit");
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const api_domain = API_DOMAIN;


  if (userType == 'master') {
    userEmail = 1;
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBtntext(
      `<div role="status" class="flex justify-center items-center">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>`
    );

    const formData = new FormData();
    formData.append("churchname", churchName);
    formData.append("postalAddress", churchLocation);
    formData.append("added_by", userEmail);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(api_domain + "/church/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.status === 201) {
        toast.success("Submitted Successfully!");
        setChurchName("");
        setChurchLocation("");
        setImage(null);
        setImagePreview(null);
        setIsLoading(false);
        setBtntext("Submit");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsLoading(false);
      setBtntext("Submit");
    }
  };


  return (
    <div className="h-full sm:flex sm:flex-row sm:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen bg-slate-50 text-black ">
        <div className="sm:w-full">
          <div className="spec_header">
            <div className="flex justify-around column px-12 items-center mb-1">
              <div className="sm:pr-10 flex flex-row items-center">
                <AiOutlineMenu className="sm:hidden" />
                <Link to="/church/form">
                  <h5 className="text-white text-lg font-bold sm:font-medium sm:text-xl">
                    Add Church
                  </h5>
                </Link>
              </div>

              <div>
                <Link to={"/churches"}>
                  <h5 className="hidden link_text sm:inline text-3xl sm:font-medium sm:text-xl ">
                    All Churches
                  </h5>
                </Link>
              </div>
            </div>
          </div>

          <h1 className="text-center font-serif font-extrabold text-3xl uppercase text-gray-500 mt-10 mb-2">
            Add New Church
          </h1>



          <form onSubmit={handleSubmit} className="flex flex-col px-8 pt-1 sm:pt-8 sm:space-y-10 h-screen">
            <div className="flex gap-4 items-center">
              <label htmlFor="name" className="w-40">Church Name:</label>
              <input
                type="text"
                value={churchName}
                className="py-2 pl-4 border border-black-500 rounded-lg w-full"
                placeholder="Type..."
                onChange={(e) => setChurchName(e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center">
              <label htmlFor="email" className="w-40">Church Location:</label>
              <input
                type="text"
                value={churchLocation}
                className="py-2 pl-4 border border-black-500 rounded-lg w-full"
                placeholder="Type..."
                onChange={(e) => setChurchLocation(e.target.value)}
              />
            </div>

            {imagePreview && (
              <div className="mb-4 mx-auto w-40">
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
              </div>
            )}

            <div className="flex gap-4 items-center">
              <label htmlFor="image" className="w-40">Church Image:</label>
              <input
                type="file"
                className="py-2 pl-4 border border-black-500 rounded-lg w-full"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <button className="submit_btn">
              {isLoading ? <span dangerouslySetInnerHTML={{ __html: btntext }} /> : btntext}
            </button>
          </form>




          <MenuBar />
        </div>
      </div>

      <Toaster />
      <SideBoard />
    </div>
  );
};

export default PrayerRequest;

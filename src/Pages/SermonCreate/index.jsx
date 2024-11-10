import { useState } from "react";
import MenuBar from "../../Components/MenuBar";
import axios from "axios";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { API_DOMAIN } from '../../config';
import toast, { Toaster } from 'react-hot-toast'

const SermonCreate = () => {
  const [sermonTitle, setSermonTitle] = useState("");
  const [sermonSpeaker, setSermonSpeaker] = useState("");
  const [sermonDescription, setSermonDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const api_domain = API_DOMAIN;
  const [btntext, setBtntext] = useState("Submit");
  const [isLoading, setIsLoading] = useState(false);
  const userType = localStorage.getItem("userType");

  const handleVideoChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedVideo(event.target.files[0]);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
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


    try {
      const formData = new FormData();
      formData.append("title", sermonTitle);
      formData.append("speaker", sermonSpeaker);
      formData.append("description", sermonDescription);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      if (selectedVideo) {
        formData.append("video", selectedVideo);
      }

      const response = await axios.post(
        api_domain + "/videos",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      if (response.status === 201) {
        toast.success('Sermon Created Successfully!');
        setBtntext('Submit');
        setSermonTitle("");
        setSermonSpeaker("");
        setSermonDescription("");
        setSelectedImage(null);
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error('Sermon Could Not Create!');
      setBtntext('Submit');
    }
  };
  return (
    <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen flex flex-col justify-between h-full bg-slate-50 text-black">
        <div className="sm:w-full">
          <div className="spec_header">
            <div className="flex justify-around column px-12 items-center mb-1">
              <div className="sm:pr-10 flex flex-row items-center">
                <AiOutlineMenu className="sm:hidden" />
                <Link to="/sermons">
                  <h5 className="text-gray-300 text-lg sm:text-xl">
                    Sermon
                  </h5>
                </Link>
              </div>
              {userType == "Admin" || userType == 'master' ? (
                <div className="sm:pr-10">
                  <Link to="/sermons/form">
                    <h5 className="sm:inline text-white text-3xl sm:text-xl font-bold">
                      Add Sermon
                    </h5>
                  </Link>
                </div>
              ) : (
              <div>
                <Link to={"/sermons/downloads"}>
                  <h5 className="hidden link_text sm:inline text-gray-300 text-3xl sm:text-xl ">
                    Downloads
                  </h5>
                </Link>
              </div>
              )}
            </div>
          </div>


          <form
            className="flex flex-col mx-6 space-y-3 mt-6 mb-16 "
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div>
              <label htmlFor="fullName">Sermon Title:</label>
              <div className="flex  flex-row space-x-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                  className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-72 sm:w-full"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email">Sermon Speaker:</label>
              <div className="flex  flex-row space-x-2">
                <input
                  type="text"
                  placeholder="Email"
                  value={sermonSpeaker}
                  onChange={(e) => setSermonSpeaker(e.target.value)}
                  className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-72 sm:w-full"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber">Sermon Description:</label>
              <div className="flex  flex-row space-x-2">
                {/* <input
                  type="text"
                  placeholder="Phone number"
                  value={sermonDescription}
                  onChange={(e) => setSermonDescription(e.target.value)}
                  className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-72 sm:w-full"
                /> */}
                <textarea
                  name=""
                  id=""
                  cols="10"
                  rows="10"
                  value={sermonDescription}
                  onChange={(e) => setSermonDescription(e.target.value)}
                  className="border border-black-500 pt-1 pr-3 pb-1 pl-2 rounded-lg sm:w-full"
                  placeholder="Description..."
                ></textarea>
              </div>
            </div>
            <div>
              <label htmlFor="appointment">Sermon Poster:</label>
              <div className="flex  flex-row space-x-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label htmlFor="appointment">Sermon Video:</label>
              <div className="flex  flex-row space-x-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <button className="rounded-full bg-purple-700 mt-6 mb-20 mx-auto px-1 py-1.5 w-32 text-white sm:mt-12">
              {isLoading ? (
                <span dangerouslySetInnerHTML={{ __html: btntext }} />
              ) : (
                btntext
              )}
            </button>
          </form>
        </div>
        <div className="lg:hidden">
          <MenuBar />
        </div>
      </div>

      <SideBoard />
      <Toaster />
    </div>
  );
};

export default SermonCreate;

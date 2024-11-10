import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import MenuBar from "../../Components/MenuBar";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import { format } from "date-fns";
import { Delete, Edit } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

const Sermons = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clear, setClear] = useState("cleared");
  const api_domain = API_DOMAIN;
  const api_web_url = API_WEB_URL;
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const [sermonTitle, setSermonTitle] = useState("");
  const [sermonSpeaker, setSermonSpeaker] = useState("");
  const [sermonDescription, setSermonDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [imageSrc, setImgSrc] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [btntext, setBtntext] = useState("UPDATE");
  const [isLoading, setIsLoading] = useState(false);
  const [sermonID, setSermonID] = useState('');


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };


  useEffect(() => {
    axios
      .get(`${api_domain}/videos`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [clear]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      handleClear();
      return;
    }

    const filteredData = data.filter((sermon) => {
      return sermon.title.toLowerCase().includes(searchValue);
    });

    setSearchQuery(e.target.value);
    setData(filteredData);
    setClear("cleared");
  };

  const handleClear = () => {
    setSearchQuery("");
    setClear("");
  };

  const userType = localStorage.getItem("userType");

  const updateRow = async (id) => {
    setSermonID(id);


    try {
      const response = await axios.get(
        api_domain + "/videos/" + id,
      );

      if (response.status === 200) {
        setSermonTitle(response.data.title);
        setSermonSpeaker(response.data.speaker);
        setSermonDescription(response.data.description);
        setImgSrc(api_web_url + '/' + response.data.image);
        setVideoSrc(api_web_url + '/' + response.data.video);
        setIsPopupOpen(!isPopupOpen);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const deleteRow = (id) => {
    axios
      .post(
        api_domain + "/delete-sermon",
        {
          deleting_id: id,
          userType: userType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data == 'success') {
          toast.success('Deleted Successfully!');
          setData((prevChurches) => prevChurches.filter((church) => church.id !== id));
        } else {
          toast.error('Not An Admin!');
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };




  const handleVideoChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const videoFile = event.target.files[0];
      setSelectedVideo(videoFile);
      setVideoSrc(URL.createObjectURL(videoFile));
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
      setImgSrc(URL.createObjectURL(imageFile));
    }
  };





  const handleUpdate = async (e) => {
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
      formData.append("sermon_id", sermonID);
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
        api_domain + "/update/video",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      if (response.status === 200) {
        toast.success('Sermon Updated Successfully!');
        setBtntext('Submit');
        setSermonTitle("");
        setSermonSpeaker("");
        setSermonDescription("");
        setSelectedImage(null);
        setSelectedVideo(null);
        setIsPopupOpen(!isPopupOpen);

        axios
          .get(`${api_domain}/videos`)
          .then((res) => {
            setData(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error('Sermon Could Not Update!');
      setBtntext('Submit');
    }
  };





  return (
    <div className="h-full lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />

      <div className="w-screen flex flex-col justify-between bg-slate-50 text-black">
        <div className="sm:w-full h-full">
          <div className="spec_header">
            <div className="flex justify-around column px-12 items-center mb-1">
              <div className="sm:pr-10 flex flex-row items-center">
                <AiOutlineMenu className="sm:hidden" />
                <Link to="/sermons">
                  <h5 className="text-white text-lg font-bold sm:text-xl">
                    Sermon
                  </h5>
                </Link>
              </div>
              {userType == "Admin" || userType == 'master' ? (
                <div className="sm:pr-10">
                  <Link to="/sermons/form">
                    <h5 className="sm:inline text-gray-300 text-3xl sm:text-xl">
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



          <div className="h-[96vh] overflow-auto pr-10 pb-10">
            {userType !== 'master' && (
              <>
                <div className="mt-6 flex-col flex sm:flex-row sm:mt-4 space-y-2 mx-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-20 p-3 h-10 mt-2 sm:mx-auto px-6 sm:w-96 border sm:py-0.5 border-black-500 rounded-3xl sm:my-2 text-black sm:block "
                    placeholder="Search..."
                  />
                  <button
                    className="w-13 bg-purple-700 px-2 text-white sm:w-56 h-10 rounded-2xl ml-1 hidden"
                    // style={{ right: '34rem', top: '3.8rem', color: 'white' }}
                    onClick={handleClear}
                  >
                    Clear Search
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                  {data.map((sermon) => {
                    const formattedTime = format(new Date(sermon.created_at), "hh:mm a");
                    const formattedDate = format(new Date(sermon.created_at), "dd-MM-yyyy");

                    return (
                      <div key={sermon.id} className="bg-gray-100 rounded-xl p-4">
                        <Link to={`/sermon_details/${sermon.id}`}>
                          {/* Header with Preacher and Admin */}
                          <div className="flex justify-between mb-4">
                            <h4 className="text-gray-600 font-medium">Preacher:</h4>
                            <span className="text-gray-800 font-semibold">{sermon.speaker || "Admin"}</span>
                          </div>

                          {/* Image and Title */}
                          <div className="relative rounded-xl overflow-hidden">
                            <img
                              src={`${api_web_url}/${sermon.image}`}
                              className="w-full h-auto object-cover"
                              alt={sermon.title}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-center capitalize">
                              {`"${sermon.title}"`}
                            </div>
                          </div>

                          {/* Footer with Time and Date */}
                          <div className="flex justify-between mt-4 text-sm text-gray-600">
                            <span>{formattedTime}</span>
                            <span>{formattedDate}</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}


            {userType === "master" && (
              <>
                <div className="overflow-auto">
                  <h2 className="text-center text-gray-500 text-2xl font-bold mt-10">
                    All Sermons
                  </h2>
                  <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Downloads</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="border border-gray-300 px-4 py-2 capitalize">
                            <img src={api_web_url + '/' + item.image} className="w-full rounded-md mb-2" />
                            {item.title}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex gap-2 items-center h-full">
                              <span onClick={() => updateRow(item.id)}>
                                <Edit className="text-green-500 cursor-pointer" />
                              </span>
                              <span onClick={() => deleteRow(item.id)}>
                                <Delete className="text-red-600 cursor-pointer"></Delete>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>




                {isPopupOpen && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full m-8 lg:w-[700px] h-[90vh] overflow-auto relative">
                      <button
                        onClick={togglePopup}
                        className="text-red-500 text-3xl font-bold absolute top-2 right-4"
                      >
                        &times;
                      </button>
                      <h2 className="text-2xl text-center font-bold">Update Sermon</h2>


                      <form
                        className="flex flex-col mx-6 space-y-3 mt-2 mb-16 "
                        onSubmit={handleUpdate}
                        encType="multipart/form-data"
                      >
                        <div>
                          <label htmlFor="fullName">Sermon Title:</label>
                          <div className="flex  flex-row space-x-2">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={sermonTitle} required
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
                              onChange={(e) => setSermonSpeaker(e.target.value)} required
                              className="pt-1 pr-6 pb-1 pl-2 border border-black-500 rounded-lg w-72 sm:w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="phoneNumber">Sermon Description:</label>
                          <div className="flex  flex-row space-x-2">
                            <textarea
                              name=""
                              id=""
                              cols="10"
                              rows="10"
                              required
                              value={sermonDescription}
                              onChange={(e) => setSermonDescription(e.target.value)}
                              className="border border-black-500 pt-1 pr-3 pb-1 pl-2 rounded-lg sm:w-full"
                              placeholder="Description..."
                            ></textarea>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="appointment">Sermon Poster:</label>
                          <img src={imageSrc} alt="image" className="sermonPoster max-w-full" />
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
                          <video src={videoSrc} controls className="sermonVideo max-w-full"></video>
                          <div className="flex  flex-row space-x-2">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>

                        <button className="rounded-full bg-blue-950 mt-6 mb-10 mx-auto px-1 py-2 w-48 text-white sm:mt-12">
                          {isLoading ? (
                            <span dangerouslySetInnerHTML={{ __html: btntext }} />
                          ) : (
                            btntext
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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

export default Sermons;

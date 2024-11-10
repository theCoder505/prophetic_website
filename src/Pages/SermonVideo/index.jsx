import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MenuBar from "../../Components/MenuBar";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { AiOutlineMenu } from "react-icons/ai";
import { API_DOMAIN, API_WEB_URL } from '../../config';

import { format } from "date-fns";

const SermonVideo = () => {
  const api_domain = API_DOMAIN;
  const api_web_url = API_WEB_URL;
  const userType = localStorage.getItem("userType");
  const { id } = useParams();
  const [data, setData] = useState({
    id: 0,
    title: "",
    description: "",
    video: { url: "" },
    image: { url: "" },
    downloaded: false,
    speaker: "",
    created_at: new Date(),
  });
  // const da = localStorage.getItem('sermonDownloads');
  // console.log(da);

  useEffect(() => {
    axios
      .get(`${api_domain}/videos/${id}`)
      .then((response) => {
        const sermonData = response.data;
        setData(sermonData);
      })
      .catch((error) => {
        console.log("Error fetching video data:", error);
      });
  }, [id]);

  const { title, description, image, video, downloaded, created_at, speaker } = data;



  const [sermonDownloads, setSermonDownloads] = useState([]);
  function handleAddToDownloads() {
    // users
    axios
      .post(
        api_domain + "/downloads/create",
        {
          user_email: localStorage.getItem("email"),
          sermon_id: id,
          title: title,
          description: description,
          image: image,
          video: video,
          downloaded: downloaded,
          sermon_created_at: created_at,
          speaker: speaker,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          const data = response.data;
          const newCartItems = [...sermonDownloads, data];
          localStorage.setItem("sermonDownloads", JSON.stringify(newCartItems));
          setSermonDownloads(sermonDownloads);
          // setCartSuccess(true);
          alert("Added To Downloads!");
          downloadVideoUrl();
          setTimeout(() => {
            // setCartSuccess(false);
          }, 3500);
        } else {
          console.warn(response.data);
          // setCartWarming(true);
          setTimeout(() => {
            // setCartWarming(false);
          }, 3500);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  }

  const downloadVideoUrl = () => {
    window.open(`${api_domain}/videos/${id}/download`, '_blank');
  };


  return (
    <div className="lg:flex lg:flex-row lg:space-x-5">
      <DashBoard />
      <div className="w-screen min-h-[100vh]">
        <div className="sm:w-full h-full flex flex-col justify-between bg-white">
          <div>
            <div className="spec_header">
              <div className="flex justify-around column px-12 items-center mb-1">
                <div className="sm:pr-10 flex flex-row items-center">
                  <AiOutlineMenu className="sm:hidden" />
                  <Link to="/sermons">
                    <h5 className="text-white text-lg font-bold sm:font-medium sm:text-xl">
                      Sermon
                    </h5>
                  </Link>
                </div>
                {userType == "Admin" || userType == 'master' ? (
                  <div className="sm:pr-10">
                    <Link to="/sermons/form">
                      <h5 className="sm:inline text-white text-3xl sm:font-medium sm:text-xl">
                        Add Sermon
                      </h5>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <Link to={"/sermons/downloads"}>
                    <h5 className="hidden link_text sm:inline text-3xl sm:font-medium sm:text-xl ">
                      Downloads
                    </h5>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mb-4 ml-2">
              <div className="flex row space-x-48 mt-2 ml-4 items-end justify-between">
                <h4 className="text-2xl font-bold ml-10 mt-4">Title:</h4>
                <h4 className="text-gray-500 pr-6">{format(new Date(created_at), "dd-MM-yyyy")}</h4>
              </div>
              <div className="mx-1.5 pt-1.5 px-2 pb-6 rounded-lg">
                <h3 className="text-center text-lg mb-4 text-gray-700">
                  {`"${title}"`}
                </h3>
                <div className="relative">
                  <iframe
                    className="w-72 h-52 sm:w-full sm:h-64"
                    src={`${api_web_url}/${video}`}
                    title="Youtube Player"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <div
                  className="flex justify-end mt-5"
                  onClick={handleAddToDownloads}
                >
                  <a
                    // href={downloadVideoUrl(data)}
                    className="text-lg text-gray-500 w-48 flex justify-center items-center gap-4">
                    Download Video
                    <img src="/download.png" alt="Download" className="w-8 h-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <MenuBar />
        </div>
      </div>
      <SideBoard />
    </div>
  );
};

export default SermonVideo;

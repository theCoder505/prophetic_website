import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import Sermons from "../Sermons";
import MenuBar from "../../Components/MenuBar";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { AiOutlineMenu } from "react-icons/ai";
import { API_DOMAIN, API_WEB_URL } from '../../config';
import { format } from "date-fns";

const SermonDetails = () => {
  const api_domain = API_DOMAIN;
  const api_web_url = API_WEB_URL;
  const userType = localStorage.getItem("userType");
  const { id } = useParams();
  const [Url, setImageUrl] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    speaker: "",
    video: "",
    downloaded: false,
    image: { url: "" },
    admin_id: 0,
    created_at: new Date(),
  });

  useEffect(() => {
    axios
      .get(`${api_domain}/videos/${id}`)
      .then((res) => {
        setData(res.data);
        setImageUrl(res.data.image);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  console.log(Url);
  const { title, speaker, description, created_at } = data;
  return (
    <div className="lg:flex lg:flex-row lg:space-x-5">
      <DashBoard />

      <div className="w-screen ">
        <div className="sm:w-full flex flex-col justify-between h-screen bg-white">
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
              <div className="mx-1.5  pt-1.5 px-2 pb-6 rounded-lg">
                <h3 className="text-center text-lg mb-4 text-gray-700">
                  {`"${title}"`}
                </h3>
                <div className="relative">
                  <Link to={`/sermon_video/${id}`}>
                    <img
                      src={`${api_web_url}/${Url}`}
                      className="rounded-2xl w-full"
                      alt=""
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 py-3 px-2 md:px-10 text-white bg-black bg-opacity-50 rounded-b-2xl">
                    <div className="flex justify-between">
                      <h4 className="">
                        Preacher: {speaker}
                      </h4>
                      <h4 className="text-gray-400 pr-6">{format(new Date(created_at), "hh:mm a")}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-24 ml-4 ">
              <p className="pb-2 text-gray-700 pr-3">{description}</p>
            </div>
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
  );
};

export default SermonDetails;

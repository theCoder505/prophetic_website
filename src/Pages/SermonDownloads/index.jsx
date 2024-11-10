import { Link } from "react-router-dom";
import MenuBar from "../../Components/MenuBar";
import DashBoard from "../../Components/DashBoard";
import SideBoard from "../../Components/SideBoard";
import { AiOutlineMenu } from "react-icons/ai";
// import { useEffect, useState } from "react";
// import { API_DOMAIN } from '../../config';

const SermonDownload = () => {
  // const [sermonDownloads, setSermonDownloads] = useState([]);
  // const api_domain = API_DOMAIN;
  // useEffect(() => {
  //   // Retrieve sermonDownloads from localStorage
  //   // const storedSermonDownloads = localStorage.getItem('sermonDownloads');

  //   // if (storedSermonDownloads) {
  //   // Parse the JSON data from localStorage
  //   const parsedSermonDownloads: SermonDownload[] = JSON.parse(
  //     localStorage.getItem(('sermonDownloads') || 'None');
  //   );

  //   // Update the state with the retrieved data
  //   setSermonDownloads(parsedSermonDownloads);
  //   // }
  // }, []);

  // useEffect(() => {
  //   const parsedSermonDownloads = JSON.parse(
  //     localStorage.getItem("sermonDownloads") || "[]"
  //   );

  //   setSermonDownloads(parsedSermonDownloads);
  // }, []);
  // console.log(sermonDownloads[0].speaker);
  const userType = localStorage.getItem("userType");

  return (
    <div className="lg:flex lg:flex-row lg:space-x-5 bg-slate-50 text-black">
      <DashBoard />
      <div className="w-screen flex flex-col h-screen justify-between bg-slate-50 text-black">
        <div className="lg:w-full">
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
                    <h5 className="sm:inline text-gray-300 text-3xl sm:text-xl">
                      Add Sermon
                    </h5>
                  </Link>
                </div>
              ) : (
              <div>
                <Link to={"/sermons/downloads"}>
                  <h5 className="hidden link_text sm:inline text-white font-bold text-3xl sm:text-xl ">
                    Downloads
                  </h5>
                </Link>
              </div>
              )}
            </div>
          </div>



          {/* <div className="mb-4 ml-2 h-96 lg:h-0">
            {sermonDownloads ? (
              sermonDownloads.map((serm) =>
                serm.map((sermon) => (
                  <div key={sermon.id} className="mb-1">
                    <Link to={`/sermon_details/${sermon.id}`}>
                      <div className="flex space-x-20 mt-2">
                        <div className="flex space-x-1 pl-6 ">
                          <h4>Admin: </h4>
                          <h3>{sermon.speaker}</h3>
                        </div>
                      </div>
                      <div className="mx-2  pt-1.5 px-3 pb-6 rounded-lg">
                        <div className="relative">
                          <img
                            src={`${api_domain}/${sermon.image.url}`}
                            className="rounded-2xl "
                            alt=""
                          />
                          <h4 className="absolute bottom-0 left-0 right-0 py-1 px-2 text-white bg-black bg-opacity-50 rounded-b-2xl">
                            {sermon.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )
            ) : (
              <div className="mb-1">
                <div>Nothing to be seen</div>
                <img src="/nothing.svg" alt="" />
              </div>
            )}
          </div> */}

          <div className="mb-4 ml-2 h-full">
            <div className="flex justify-center items-center h-full pt-10">
              <img src="/nothing.svg" alt="" className="max-w-sm" />
            </div>
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

export default SermonDownload;

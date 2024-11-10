import axios from "axios";
import { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_DOMAIN } from '../../config';
import toast, { Toaster } from "react-hot-toast";

const mountains = styled.div`
  background-image: "none";
`;

const circles = styled.div`
  background-image: url("/group-10.svg");
`;

const AdminSignUp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));
  const Background = isMobile ? circles : mountains;
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [churches, setChurches] = useState([]);
  const [church_id, setChurchId] = useState();
  const navigate = useNavigate();


  const api_domain = API_DOMAIN;
  const [btntext, setBtntext] = useState("Register");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const response = await axios.get(api_domain + "/churches");
        setChurches(response.data);
      } catch (error) {
        console.error('An error occurred while fetching the churches:', error);
      }
    };

    fetchChurches();
  }, []);



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
      const response = await axios.post(
        api_domain + "/admin/signup",
        {
          username: username,
          email: email,
          password: password,
          church_id: church_id,
          ministry_id: '',
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 && response.data.message == 'userfound') {
        toast.error('Username Exists, Try different One!');
        setIsLoading(false);
        setBtntext('Register');
      }
      if (response.status === 200 && response.data.message == 'mailfound') {
        toast.error('Email Exists, Try different One!');
        setIsLoading(false);
        setBtntext('Register');
      }
      if (response.status === 201) {
        navigate("/leader/login");
      }



    } catch (error) {
      setIsLoading(false);
      setBtntext('Register');
      if (error.response.status === 422) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Background
      className="h-full lg:flex lg:flex-row lg:space-x-2 lg:h-screen text-black"
      style={{
        backgroundImage: `url("/member_registration.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="hidden lg:block lg:w-2/4 "> </div>

      {/* sm screens */}
      <div className="px-9 py-4 flex flex-col space-y-1 text-left text-3xl lg:hidden">
        <h1 className=" text-center pt-4 mt-2 text-white text-3xl lg:hidden">
          Prophetic Tv
        </h1>
        {/* <img
          src="/logo.svg"
          className="w-13 h-13 pt-8 pb-16 sm:w-36 sm:h-40 "
          alt=""
        /> */}
        <img src="/logo.svg" className="w-18 h-24 lg:w-36 lg:h-40 " alt="" />

        <div className="mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-purple-200 flex flex-col px-8 mt-24 pb-12 w-80 rounded-lg"
          >
            <input
              className="p-2 my-6 rounded-lg"
              type="text"
              value={username}
              placeholder="User name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="p-2 my-6 rounded-lg"
              type="text"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* church entry */}
            <select
              value={church_id}
              className="p-2 my-6 rounded-lg"
              onChange={(e) => setChurchId(e.target.value)}
            >
              <option hidden className="text-sm">
                Select Church
              </option>
              {churches.map((practitioner) => {
                // const department = practitioner.admin.ministry.ministryname;
                // const location = practitioner.admin.ministry.ministrylocation;

                const churchNames = practitioner.churchname;
                const department = practitioner.postalAddress;
                const practitionerId = practitioner.id;

                return (
                  <option key={practitionerId} value={practitionerId}>
                    {churchNames + ',' + department}
                  </option>
                );
              })}
            </select>
            {/* church entry */}
            <input
              className="p-2 my-6 rounded-lg"
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex row space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                className="pr-2 lg:text-lg text-sm"
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="pl-0">Remember me</span>
            </label>
            {/* {errors} */}
            <button className="rounded-full text-white bg-purple-500 hover:bg-purple-700 py-3 px-6 mt-10">
              {isLoading ? (
                <span dangerouslySetInnerHTML={{ __html: btntext }} />
              ) : (
                btntext
              )}
            </button>
            <h6 className="text-xl mt-4">
              I have an Account?
              <span className="lg:hidden text-sky-600">
                <Link to={"/leader/login"}>Sign in</Link>
              </span>
            </h6>
          </form>
        </div>
      </div>
      {/* sm screens */}

      <div className="hidden lg:block ">
        <div className="flex flex-col space-y-4">
          <div className="flex row space-x-20 pl-10 pt-2 my-6 ml-8 pr-10 w-30 pb-1 ">
            <div>
              <Link to={"/"}>
                <img src="/left-arrow.png" className="w-8" alt="" />
              </Link>
            </div>
            <div>
              <h6 className="border-b-2 border-purple-700 font-bold">
                Admin Registration
              </h6>
            </div>

            <div>
              <Link to={"/leader/login"}>Admin Login</Link>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-purple-200 flex flex-col my-auto px-8  ml-32 pb-12 w-80 rounded-lg"
          >
            <input
              className="p-2 my-6 rounded-lg"
              type="text"
              value={username}
              placeholder="user name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="p-2 my-6 rounded-lg"
              type="text"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* church entry */}
            <select
              value={church_id}
              className="p-2 my-6 rounded-lg"
              onChange={(e) => setChurchId(e.target.value)}
            >
              <option hidden>Select Church</option>
              {churches.map((practitioner) => {
                // const department = practitioner.admin.ministry.ministryname;
                // const location = practitioner.admin.ministry.ministrylocation;

                const churchNames = practitioner.churchname;
                const department = practitioner.postalAddress;
                const practitionerId = practitioner.id;

                return (
                  <option key={practitionerId} value={practitionerId}>
                    {churchNames + ',' + department}
                  </option>
                );
              })}
            </select>
            {/* church entry */}

            <input
              className="p-2 my-6 rounded-lg"
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex row space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                className="pr-2"
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="pl-0">Remember me</span>
            </label>
            {/* {errors} */}
            <button className="rounded-full text-white bg-purple-500 hover:bg-purple-700 py-3 px-6 mt-10">
              {isLoading ? (
                <span dangerouslySetInnerHTML={{ __html: btntext }} />
              ) : (
                btntext
              )}
            </button>
            <h6 className="text-xl mt-4">
              I have an Account?
              <span className=" text-sky-600">
                <Link to={"/leader/login"}>Sign in</Link>
              </span>
            </h6>
          </form>
        </div>
      </div>
      <Toaster />
    </Background>
  );
};

export default AdminSignUp;

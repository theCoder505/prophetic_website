import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_DOMAIN, API_WEB_URL, SERVER_URL } from "../config";
import { ArrowBackIosNew, SendOutlined } from "@mui/icons-material";
import io from 'socket.io-client';
const socket = io(SERVER_URL);


const SideBoard = () => {
  const userType = localStorage.getItem("userType");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("email");
  const loggerID = localStorage.getItem("logger_id");
  const [users, setUsers] = useState([]);
  const [superAdmin, setSuperAdmin] = useState([]);
  const [profileImages, setProfileImages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [chatHeadText, setChatHeadText] = useState('Messages');
  const [chatText, setChatText] = useState("");
  const [userID, setUserID] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatboxRef = useRef(null);
  const [reciverType, setReciverType] = useState([]);
  const [prevMessages, setPrevMessages] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);

  const [masterName, setMasterName] = useState('');
  const [masterImage, setMasterImage] = useState('');
  const [masterMessage, setMasterMessage] = useState('');
  const [masterLastMsgTime, setMasterLastMsgTime] = useState('');

  // about users showing and management for chat
  useEffect(() => {
    setIsChatLoading(true);
    setChatText(`<div role="status" class="flex justify-center items-center">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>`);

    if (userType == 'Admin') {
      setReciverType('Member');
    } else if (userType == 'Member') {
      setReciverType('Admin');
    } else {
      setReciverType('master');
    }


    axios.post(
      `${API_DOMAIN}/fetch-all-users`,
      { userType, userName, userEmail },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {
        setSuperAdmin(response.data.master_admin);
        setUsers(response.data.all_users);
        setProfileImages(response.data.user_profiles);
        setIsChatLoading(false);
        setChatText('');
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, [userType, userName, userEmail]);



  const searchUser = (value) => {
    setChatHeadText('Search Results');
    setSearchText(value);
    if (value == '') {
      setChatHeadText('Followers');
    }
  }




  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        messageText,
        senderID: loggerID,
        senderType: userType,
        reciverID: userID,
        reciverType: reciverType,
      };

      // Emit message to socket.io server | Sending message to server
      socket.emit("send_message", newMessage);


      setMessages([
        ...messages,
        { messageText, reciverID: userID, reciverType }
      ]);


      axios.post(
        `${API_DOMAIN}/send-message`,
        {
          userType,
          userName,
          userEmail,
          userID,
          messageText,
          reciverType: reciverType
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      )
        .then(() => { })
        .catch((error) => {
          console.error('An error occurred:', error);
        });

      setMessageText("");


      const currentDate = new Date();
      const formattedTime = currentDate.toLocaleString("en-GB", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      });
      const formattedDateTime = `${formattedTime} ${formattedDate}`;
      const chatElementId = reciverType + userID;
      let chatElement = document.getElementById(chatElementId);



      if (chatElement) {
        chatElement.querySelector(".main_msg").innerHTML = messageText;
        chatElement.querySelector(".msging_time").innerHTML = `${formattedDateTime}`;
        const allChatList = document.querySelector(".all_chat_list");
        allChatList.prepend(chatElement);
      } else {
        chatElement = document.createElement("div");
        chatElement.id = chatElementId;
        chatElement.classList.add("chat-item");
        chatElement.innerHTML = `
        <div class="flex items-center cursor-pointer" id="master1">
        <div class="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
          <img src="${API_WEB_URL}${selectedUser.profileImg}" alt="A" class="w-full h-full">
        </div>
        <div class="ml-4 message_right">
        <div class="flex justify-between items-end">
        <div>
          <div class="text-white text-sm font-bold capitalize">${userName}</div>
          <div class="text-gray-200 text-xs capitalize main_msg">${messageText}</div>
        </div>
        <div class="text-gray-400 text-xs uppercase msging_time">${formattedDateTime}</div>
        </div>
        </div>
        </div>`;
        const allChatList = document.querySelector(".all_chat_list");
        allChatList.prepend(chatElement);
      }
    }
  };



  const chooseAdmin = () => {
    scrollToBottom();
    setShowFollowers(true);


    setSelectedUser({
      id: 1,
      username: masterName,
      profileImg: masterImage
    });


    axios.post(
      `${API_DOMAIN}/check-specific-messages`,
      {
        loggerType: userType,
        loggerEmail: userEmail,
        textWith: 1,
        textWithUserType: 'master',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {
        setMessages(response.data.messages);
        setUserID(1);
        setReciverType('master');
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };


  const chooseUser = (selectedUserType, user) => {
    scrollToBottom();
    setShowFollowers(true);


    setSelectedUser({
      id: user.id,
      username: user.username,
      profileImg: profileImages.find(
        (profileImg) => profileImg.userID == user.id && profileImg.userType == selectedUserType
      )?.user_image,
    });


    console.log({
      id: user.id,
      username: user.username,
      profileImg: profileImages.find(
        (profileImg) => profileImg.userID == user.id && profileImg.userType == selectedUserType
      )?.user_image,
    });


    console.log(selectedUser);



    axios.post(
      `${API_DOMAIN}/check-specific-messages`,
      {
        loggerType: userType,
        loggerEmail: userEmail,
        textWith: user.id,
        textWithUserType: selectedUserType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {
        setMessages(response.data.messages);
        setUserID(user.id);
        setReciverType(selectedUserType);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };



  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const backToUsers = () => {
    setChatHeadText('People');
    setSelectedUser(null);
  }



  // fetching & showing the chat list 
  useEffect(() => {
    axios.post(
      `${API_DOMAIN}/messages-list`,
      {
        userType,
        userEmail
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    )
      .then((response) => {
        setIsChatLoading(false);
        setPrevMessages(response.data.prev_list);
        console.log(response.data.prev_list);
        

        if (userType != 'master') {
          setMasterName(response.data.admin_username);
          setMasterImage(response.data.admin_image);
          setMasterMessage(response.data.master_msg);
          setMasterLastMsgTime(response.data.master_msg_time);
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, [])



  const searchFollowers = () => {
    setChatHeadText('People');
    setShowFollowers(true);
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const time = new Intl.DateTimeFormat('en-US', options).format(date);
    const formattedDate = `${time} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };


  const backToMessages = () => {
    setChatHeadText('Messages');
    setShowFollowers(false);
  }







  // socket Io Part | Receive messages from socket
  // Only display message if it matches the loggerID and loggerType
  useEffect(() => {
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleString("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
    const formattedDateTime = `${formattedTime} ${formattedDate}`;



    socket.on("receive_message", (data) => {
      console.log(loggerID, userType, userID, reciverType);
      console.log(data);

      // reciverType should set according to the choosen user type 
      // reciverType setted properly for member but not yet for leader, to do this

      if (data.reciverID == loggerID && data.reciverType == userType) {
        console.log('new msg!');
        if (data.senderID == userID && data.senderType == reciverType) {
          setMessages((oldmsgs) => [...oldmsgs, data]);
        }


        const chatElementId = data.senderType + data.senderID;
        let chatElement = document.getElementById(chatElementId);

        if (chatElement) {
          chatElement.querySelector(".main_msg").innerHTML = data.messageText;
          chatElement.querySelector(".msging_time").innerHTML = `${formattedDateTime}`;
        } else {
          chatElement = document.createElement("div");
          chatElement.id = chatElementId;
          chatElement.classList.add("chat-item");
          chatElement.innerHTML = `
        <div class="main_msg">${data.messageText}</div>
        <div class="msging_time">${formattedDateTime}</div>`;
        }
        const allChatList = document.querySelector(".all_chat_list");
        allChatList.prepend(chatElement);
      }
    });
  }, [userID]);






  return (
    <div>
      {/* lg screens dashboar */}
      <div className="hidden lg:block bg-purple-700 w-[400px] h-full pt-8 px-6 pb-4 text-white">
        <div className="flex flex-col p-4">

          <div className="bg-purple-800 text-white p-4 rounded-lg shadow-md">

            {/* Previous messages  */}
            <div className={`chat_container ${showFollowers ? "hidden" : ""}`}>
              <div className="text-lg font-semibold">{chatHeadText}</div>

              {/*n Chat Listing | Not For SuperAdmin */}
              {!isChatLoading && masterMessage !== null && userType != 'master' && (
                <div
                  className="flex items-center cursor-pointer border-b-2 border-purple-700 py-3"
                  onClick={() => chooseAdmin()}
                  id="master1"
                >
                  <div className="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
                    <img
                      src={`${API_WEB_URL}${masterImage}`}
                      alt={userName.charAt(0)}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="ml-4 message_right">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white text-sm font-bold capitalize">{masterName}</div>
                        <div className="text-gray-200 text-xs capitalize main_msg">
                          {masterMessage.length > 20 ? `${masterMessage.slice(0, 20)}...` : masterMessage}
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs uppercase msging_time">
                        {formatDate(masterLastMsgTime)}
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* chat listing for all, including super admin  */}
              <div className="user_list">
                <div className="mt-4 space-y-4 min-h-[250px] max-h-[400px] overflow-y-auto all_chat_list">
                  {isChatLoading ? (
                    <span dangerouslySetInnerHTML={{ __html: chatText }} />
                  ) : (
                    (() => {
                      const displayedUsers = new Set();

                      return prevMessages.map((message, index) => {
                        const isSentByLogger = message.senderID == loggerID && message.userType == userType;
                        const otherUserID = isSentByLogger ? message.reciverID : message.senderID;
                        const otherUserType = isSentByLogger ? message.reciverType : message.userType;
                      
                        var userKey = `${otherUserType}${otherUserID}`;
                        if (displayedUsers.has(userKey)) return null;
                        displayedUsers.add(userKey);
                      
                        let user;
                        let userName = "";
                        if (userType == "master") {
                          user = users.find((user) => user.id == otherUserID && user.usertype == otherUserType);
                        } else {
                          user = users.find((user) => user.id == otherUserID);
                        }
                        userName = user ? user.username : "";
                      
                        const profileImage =
                          user &&
                          profileImages.find(
                            (profileImg) => profileImg.userID == otherUserID && profileImg.userType == otherUserType
                          )?.user_image;
                      
                        if (userName != "") {
                          return (
                            <div
                              key={index}
                              className="flex items-center cursor-pointer"
                              onClick={() => chooseUser(otherUserType, user)}
                              id={userKey}
                            >
                              <div className="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
                                {profileImage ? (
                                  <img
                                    src={`${API_WEB_URL}${profileImage}`}
                                    alt={user.username.charAt(0)}
                                    className="w-full h-full"
                                  />
                                ) : (
                                  <span className="text-white text-lg flex justify-center items-center font-bold capitalize">
                                    {user.username.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="ml-4 message_right">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <div className="text-white text-sm font-bold capitalize">{user.username}</div>
                                    <div className="text-gray-200 text-xs capitalize main_msg">
                                      {message.messageText.length > 20 ? `${message.messageText.slice(0, 20)}...` : message.messageText}
                                    </div>
                                  </div>
                                  <div className="text-gray-400 text-xs uppercase msging_time">{formatDate(message.created_at)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      });
                      
                    })()
                  )}
                </div>



                <div className="mt-4">
                  <button
                    className="w-full py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white text-zinc-500"
                    onClick={searchFollowers}
                  >
                    Search People
                  </button>
                </div>
              </div>
            </div>




            {/* Followers list & message box  */}
            <div className={`chat_container ${showFollowers ? "" : "hidden"}`}>
              {/* all users list  */}
              {!selectedUser ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{chatHeadText}</div>
                    <div className="cursor-pointer" onClick={backToMessages}>
                      <ArrowBackIosNew />
                    </div>
                  </div>

                  <div className="user_list">
                    <div className="mt-4 space-y-4 min-h-[250px] max-h-[400px] overflow-y-auto">
                      {isChatLoading ? (
                        <span dangerouslySetInnerHTML={{ __html: chatText }} />
                      ) : (
                        chatText
                      )}


                      {/* Admin  */}
                      {userType != 'master' && superAdmin.filter((admin) =>
                        admin.username.toLowerCase().includes(searchText.toLowerCase())
                      ).length > 0 ? (
                        superAdmin
                          .filter((admin) =>
                            admin.username.toLowerCase().includes(searchText.toLowerCase())
                          )
                          .map((admin) => {
                            const matchingProfileImg = profileImages.find(
                              (profileImg) => profileImg.userID == admin.id
                            );
                            return (
                              <div
                                key={admin.id}
                                className="flex items-center cursor-pointer"
                                onClick={() => chooseAdmin(admin)}
                              >
                                <div className="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
                                  {matchingProfileImg ? (
                                    <img
                                      src={`${API_WEB_URL}${matchingProfileImg.user_image}`}
                                      alt={admin.username.charAt(0)}
                                      className="w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-white text-lg flex justify-center items-center font-bold capitalize">
                                      {admin.username.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div className="ml-4 message_right">
                                  <div className="flex justify-between text-gray-200 text-lg capitalize">
                                    {admin.username}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="text-gray-400 text-center"></div>
                      )}
                      {/* Admin part done */}

                      {users.filter((user) =>
                        user.username.toLowerCase().includes(searchText.toLowerCase())
                      ).length > 0 ? (
                        users
                          .filter((user) =>
                            user.username.toLowerCase().includes(searchText.toLowerCase())
                          )
                          .map((user, index) => {
                            var matchingProfileImg = '';
                            var selectingType = '';
                            if (userType == 'master') {
                              matchingProfileImg = profileImages.find(
                                (profileImg) => profileImg.userID == user.id && profileImg.userType == user.user_type
                              );
                              selectingType = user.user_type;
                            } else {
                              matchingProfileImg = profileImages.find(
                                (profileImg) => profileImg.userID == user.id && profileImg.userType == reciverType
                              );
                              selectingType = reciverType;
                            }

                            return (
                              <div
                                key={index}
                                className="flex items-center cursor-pointer"
                                onClick={() => chooseUser(selectingType, user)}
                              >
                                <div className="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
                                  {matchingProfileImg ? (
                                    <img
                                      src={`${API_WEB_URL}${matchingProfileImg.user_image}`}
                                      alt={user.username.charAt(0)}
                                      className="w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-white text-lg flex justify-center items-center font-bold capitalize">
                                      {user.username.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div className="ml-4 message_right">
                                  <div className="flex justify-between text-gray-200 text-lg capitalize">
                                    {user.username}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="text-gray-400 text-center">No Match</div>
                      )}
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full py-2 px-6 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        value={searchText}
                        onChange={(e) => searchUser(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                // chating with user | Message Box
                <div className="user_chat">
                  <div className="flex justify-between items-center cursor-pointer gap-2">
                    <div className="flex items-center cursor-pointer gap-2">
                      <div className="w-12 h-[45.33px] bg-gray-800 flex items-center justify-center rounded-full overflow-hidden">
                        {selectedUser.profileImg ? (
                          <img
                            src={`${API_WEB_URL}${selectedUser.profileImg}`}
                            alt="User"
                            className="w-full h-full selected_user_img"
                          />
                        ) : (
                          <span className="text-white text-lg font-bold capitalize">
                            {selectedUser.username.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="message_right">
                        <div className="flex justify-between text-gray-200 text-lg capitalize selected_user_name">
                          {selectedUser.username}
                        </div>
                      </div>
                    </div>
                    <div className="cursor-pointer" onClick={backToUsers}>
                      <ArrowBackIosNew />
                    </div>
                  </div>

                  <div ref={chatboxRef}
                    className="mt-4 space-y-1 h-[400px] overflow-y-auto bg-purple-700 p-4 chatbox">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex justify-${((message.reciverID == userID) && (message.reciverType == reciverType)) ? "end" : "start"}`}>
                        <div
                          className={`${((message.reciverID == userID) && (message.reciverType == reciverType)) ? "bg-purple-900" : "bg-teal-900"
                            } rounded-xl ${((message.reciverID == userID) && (message.reciverType == reciverType)) ? "rounded-br-none" : "rounded-tl-none"} px-2 py-1 max-w-[200px] text-xs break-words`}
                        >
                          <div style={{ whiteSpace: "pre-wrap" }}>{message.messageText}</div>
                        </div>
                      </div>
                    ))}
                  </div>




                  <div className="mt-4 flex rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white px-2 overflow-hidden">
                    <input type="hidden" name="text_to" value={userID} />
                    <textarea
                      placeholder="Type something..."
                      className="w-full py-2 text-black px-4 outline-none resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={1}
                    />
                    {messageText.trim() && (
                      <button className="text-purple-800" onClick={handleSendMessage}>
                        <SendOutlined />
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>










          {userType == 'Admin' && (
            <div className="mt-8 bg-purple-800 text-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-center mt-5 mb-8">
                <Link to={"/churchinvitation"}
                  className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-black text-3xl font-bold">+</span>
                </Link>
              </div>
              <div className="text-lg font-semibold text-center my-2">Partnership with other Churches</div>
              <p className="mt-2 text-gray-200 text-lg px-6 h-40">
                Invites other Churches to minister <br /> in live streaming with audience.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* lg screens dashboard */}
    </div>
  );
};

export default SideBoard;

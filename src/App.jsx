import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PrayerRequest from "./Pages/PrayerRequest";
import PrayerList from "./Pages/PrayerList";
import Donation from "./Pages/Donation";
import SeedDonation from "./Pages/SeedDonation";
import TitheDonation from "./Pages/TitheDonation";
import Sermons from "./Pages/Sermons";
import SermonDetails from "./Pages/SermonDetails";
import SermonVideo from "./Pages/SermonVideo";
import Appointment from "./Pages/Appointment";
import Invitation from "./Pages/Invitation";
import InvitationInviteUrl from "./Pages/InvitationInviteUrl";
import SplashBar from "./Components/SplashBar";
import { useState } from "react";
import Dashboard from "./Pages/Dashboard";
import MemberSignUpPage from "./Pages/MemberSignUpPage";
import MemberLoginPage from "./Pages/MemberLoginPage";
import Landing from "./Pages/Landing";
import StartStreaming from "./Pages/StartStreaming";
import StreamingRecords from "./Pages/StreamingRecords";
import MemberHome from "./Pages/MemberHome";
import AdminHome from "./Pages/AdminHome";
import MasterHome from "./Pages/MasterHome";
import AdminLogin from "./Pages/AdminLogin";
import AdminSignUp from "./Pages/AdminSignUp";
import MasterLogin from "./Pages/MasterLogin";
import LiveStream from "./Pages/LiveStream";
import SermonCreate from "./Pages/SermonCreate";
import Churches from "./Pages/Churches";
import ChurchCreate from "./Pages/ChurchCreate";
import SermonDownload from "./Pages/SermonDownloads";
import { useMediaQuery, useTheme } from "@mui/material";
import LobbyForm from "./Pages/Lobby/lobby";
import LiveStreaming from "./Pages/LiveStreaming";
import Participants from "./Pages/Participants";
import Chatroom from "./Pages/Chatroom";
import StartMeeting from "./Pages/StartMeeting";
import MembersStreaming from "./Pages/MembersStreaming";
import EndMeeting from "./Pages/EndMeeting";
import ChurchInvitation from "./Pages/ChurchInvitation";
import MemberList from "./Pages/MemberList";
import LeadersList from "./Pages/LeadersList";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/member/login" replace />;
  }
  return children;
};

const App = () => {
  const [showHomePage, setShowHomePage] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));

  const handleSplashScreenFinish = () => {
    setShowHomePage(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            showHomePage ? (
              <Landing />
            ) : isMobile ? (
              <SplashBar onFinish={handleSplashScreenFinish} />
            ) : (
              <Landing />
            )
          }
        />

        <Route path="/landing" element={<Landing />} />
        <Route path="/member/sign" element={<MemberSignUpPage />} />
        <Route path="/member/login" element={<MemberLoginPage />} />
        <Route path="/leader/sign" element={<AdminSignUp />} />
        <Route path="/leader/login" element={<AdminLogin />} />
        <Route path="/master/sign" element={<MasterLogin />} />

        <Route path="/demo-streaming" element={<LiveStream />} />


        {/* protected routes  */}
        <Route path="/room" element={<ProtectedRoute> <InvitationInviteUrl /> </ProtectedRoute>} />

        <Route path="/lobby" element={<ProtectedRoute> <StartStreaming /> </ProtectedRoute>} />

        <Route path="/streaming-records" element={<ProtectedRoute> <StreamingRecords /> </ProtectedRoute>} />

        <Route path="/livestreaming" element={<ProtectedRoute> <LiveStreaming /> </ProtectedRoute>} />

        <Route path="/participants" element={<ProtectedRoute> <Participants /> </ProtectedRoute>} />

        <Route path="/chatroom" element={<ProtectedRoute> <Chatroom /> </ProtectedRoute>} />

        <Route path="/start" element={<ProtectedRoute> <StartMeeting /> </ProtectedRoute>} />

        <Route path="/streaming" element={<ProtectedRoute> <MembersStreaming /> </ProtectedRoute>} />

        <Route path="/endmeeting" element={<ProtectedRoute> <EndMeeting /> </ProtectedRoute>} />

        <Route path="/lobby2" element={<ProtectedRoute> <LobbyForm /> </ProtectedRoute>} />

        <Route path="/churchInvitation" element={<ProtectedRoute> <ChurchInvitation /> </ProtectedRoute>} />

        <Route path="/admin/home" element={<ProtectedRoute> <AdminHome /> </ProtectedRoute>} />

        <Route path="/master/home" element={<ProtectedRoute> <MasterHome /> </ProtectedRoute>} />

        <Route path="/member/home" element={<ProtectedRoute> <MemberHome /> </ProtectedRoute>} />

        <Route path="/prayer" element={<ProtectedRoute> <PrayerRequest /> </ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

        <Route path="/prayers" element={<ProtectedRoute> <PrayerList /> </ProtectedRoute>} />

        <Route path="/donations" element={<ProtectedRoute> <Donation /> </ProtectedRoute>} />

        <Route path="/seeddonations" element={<ProtectedRoute> <SeedDonation /> </ProtectedRoute>} />

        <Route path="/tithedonations" element={<ProtectedRoute> <TitheDonation /> </ProtectedRoute>} />

        <Route path="/sermons" element={<ProtectedRoute> <Sermons /> </ProtectedRoute>} />

        <Route path="/sermons/form" element={<ProtectedRoute> <SermonCreate /> </ProtectedRoute>} />

        <Route path="/churches" element={<ProtectedRoute> <Churches /> </ProtectedRoute>} />

        <Route path="/church/form" element={<ProtectedRoute> <ChurchCreate /> </ProtectedRoute>} />

        <Route path="/sermons/downloads" element={<ProtectedRoute> <SermonDownload /> </ProtectedRoute>} />

        <Route path="/sermon_details/:id" element={<ProtectedRoute> <SermonDetails /> </ProtectedRoute>} />

        <Route path="/sermon_video/:id" element={<ProtectedRoute> <SermonVideo /> </ProtectedRoute>} />

        <Route path="/appointment" element={<ProtectedRoute> <Appointment /> </ProtectedRoute>} />

        <Route path="/church-invitations" element={<ProtectedRoute> <Invitation /> </ProtectedRoute>} />

        <Route path="/invitation" element={<ProtectedRoute> <Invitation /> </ProtectedRoute>} />

        <Route path="/invitation/:church_id/:church_invite_url" element={<ProtectedRoute> <InvitationInviteUrl /> </ProtectedRoute>} />

        <Route path="/members" element={<ProtectedRoute> <MemberList /> </ProtectedRoute>} />

        <Route path="/leaders" element={<ProtectedRoute> <LeadersList /> </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;

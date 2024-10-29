import { useRecoilValue } from "recoil"
import Video from "./Video"
import { hamburger } from "../context/hamburger.atoms"
import Sidebar from "../components/Sidebar"
import '../styles/dashboard.css'
function Dashboard() {
  const isSidebarOpen = useRecoilValue(hamburger)
  return (
    <div>
      {/*
      
      Videos , search box, home(which leads to the videos), subscriptions, you> History,  watch later,  
      Liked videos, playlists, your videos, channels that I subscribed, a notification bell, and side of it
      a avatar of my own
      */}

      <div className="dashboard__content">
        {isSidebarOpen && <Sidebar />}
        <div className={`dashboard__videos ${isSidebarOpen ? "with-sidebar" : ""}`}>
          <Video />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
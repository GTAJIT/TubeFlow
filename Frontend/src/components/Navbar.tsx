// Navbar.tsx
import menuIcon from '../../public/assets/menu.png';
import logo from '../../public/assets/logo.png';
import search from '../../public/assets/search.png';
import upload from '../../public/assets/upload.png';
import userProfile from '../../public/assets/user_profile.jpg';
import '../styles/component_styles/navbar.css';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useSetRecoilState } from 'recoil';
import { hamburger } from '../context/hamburger.atoms';

type UserDetails = {
  id: "";
  username: "";
  email: "";
  fullName: "";
  avatar: "";
  coverImage: "";
  password: "";
  refreshToken: "";
  createdAt: "";
  updatedAt: "";
};

function Navbar() {
const [userDetails, setUserDetails] = useState<UserDetails>({
  id: "",
  username: "",
  email: "",
  fullName: "",
  avatar: "",
  coverImage: "",
  password: "",
  refreshToken: "",
  createdAt: "",
  updatedAt: ""
})
const setHamburger = useSetRecoilState(hamburger)
  useEffect(()=>{
    const token = localStorage.getItem('token')
    api.get('/user/get-current-user',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then((res: any)=>{
        setUserDetails(res.data.user)
        console.log(res.data)
    })
  },[])
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={menuIcon} alt="Menu Icon" className="navbar__icon" onClick={()=>{
          setHamburger((item)=>!item)
        }}/>
        <img src={logo} alt="Logo" className="navbar__logo" />
      </div>

      <div className="navbar__center">
        <input type="search" placeholder="Search" className="navbar__search-input" />
        <button className="navbar__search-button">
          <img src={search} alt="Search Icon" />
        </button>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-button">
          <img src={upload} alt="Upload Icon" className="navbar__icon" />
        </button>
        <button className="navbar__icon-button">
          <img src={userDetails.avatar || userProfile} alt="User Profile" className="navbar__profile-img" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

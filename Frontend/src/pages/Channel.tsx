import { useEffect, useState } from 'react';
import '../styles/channel.css';
import api from '../services/api';

const Channel = () => {
    const [channelDetails, setChannelDetails] = useState({
        subscribers: "",
        subscribed: "",
        username: "",
        avatar: "",
        coverImage: "",
        fullName: ""
    })
    
    useEffect(()=>{
        api.get('/user/c/mohak')
        .then((res)=>{
            setChannelDetails(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
        
    }, [])
  return (
    <div className="channel-container">
      <div className="channel-header">
        <div className="channel-banner"></div>
        <div className="channel-info">
          <img
            src={channelDetails.avatar}
            alt="Channel Profile"
            className="channel-profile-pic"
          />
          <div className="channel-details">
            <h1 className="channel-name">{channelDetails.fullName}</h1>
            <p className='channel-username'>@{channelDetails.username}</p>
            <p className="channel-subscribers">{channelDetails.subscribers} Subscribers</p>
            <p className="channel-description">
              Welcome to my channel! Here you'll find amazing content about various topics. Don't forget to subscribe!
            </p>
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Channel;

import { useEffect, useState } from 'react';
import '../styles/channel.css';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Channel = () => {
    const {username} = useParams()
    const [channelDetails, setChannelDetails] = useState({
        id: "",
        subscribers: "",
        subscribed: "",
        username: "",
        avatar: "",
        coverImage: "",
        fullName: ""
    })
    
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [clientUserId, setClientUserId] = useState("")
    useEffect(()=>{
        api.get(`/user/c/${username}`)
        .then((res)=>{
            setChannelDetails(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }, [username])
  
    useEffect(()=>{
      api.get("/user/get-current-user")
      .then((res)=>{
        setClientUserId(res.data.user.id)
      })
    }, [])
    useEffect(()=>{
      
      api.get(
        `/subscription/get-subscribed-channels/${clientUserId}`
      ).then((res)=>{
        //@ts-ignore
        const result = res.data.existingSubscriber.some((item)=>item.channelId == channelDetails.id)

        setIsSubscribed(result)
      })
    }, [clientUserId, channelDetails.id])

    const [content, setContent] = useState(false)
   
  return (
    <div className="channel-container">
      <div className="channel-header">
        <div className="channel-banner">
          <img src="https://img.lovepik.com/background/20211021/large/lovepik-cool-line-technology-banner-background-image_400112106.jpg" alt="" />
        </div>
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
            <button className={isSubscribed?"subscribed-button":"subscribe-button"}>{isSubscribed ? "Subscribed": "Subscribe"}</button>
          </div>
        </div>
      </div>
        {/* [TODO]: Create a Home, Videos, Playlist, Tweets section */}

        <hr />
        <div className='outer-div'>
        <div className='option-group'>
          <div onClick={()=> setContent(!content)} className="options">Home</div>
          <div onClick={()=> setContent(!content)} className="options">Videos</div>
          <div onClick={()=> setContent(!content)} className="options">Playlist</div>
          <div onClick={()=> setContent(!content)} className="options">Tweets section</div>
          <div className="inner-content">
          </div>
        </div>


        {content ? 'content' : ''}
        </div>
      
      
    </div>
  );
};

export default Channel;

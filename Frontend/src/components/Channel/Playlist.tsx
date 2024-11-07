import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import '../../styles/component_styles/playlist.css'

//@ts-ignore
function Playlist(props) {
  const [playlists, setPlaylists] = useState([
    {
      id: 0,
      name: "",
      description: ""
    }
  ])
  useEffect(()=>{
    api.get(`/playlist/user/${props.id}`)
    .then((res)=>{
      setPlaylists(res.data.result)
    })
  }, [props.id])
  return (
    <div className="playlist-container">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="playlist-card">
          <h3>{playlist.name}</h3>
          <p>{playlist.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Playlist
import { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../styles/component_styles/playlist.css';

type Playlist = {
  id: number;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  firstVideo: {
    thumbnail?: string;
  };
}[];

//@ts-ignore
function Playlist(props) {
  const [playlists, setPlaylists] = useState<Playlist>([]);

  useEffect(() => {
    api.get(`/playlist/user/${props.id}`)
      .then((res) => {
        // Ensure result is always an array
        // console.log(res.data["0"])
        setPlaylists(Array.isArray(res.data.finalResult) ? res.data.finalResult : []);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setPlaylists([]); // Set to empty array in case of error
      });
  }, [props.id]);

  return (
    <div className="playlist-container">
      {playlists && playlists.length > 0 ? (
        playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <img 
              src={playlist.firstVideo?.thumbnail} 
              alt="Playlist thumbnail" 
            />
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
          </div>
        ))
      ) : (
        <p>No playlists available</p>
      )}
    </div>
  );
}

export default Playlist;

import { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../styles/component_styles/playlist.css';
import { faSlash } from '@fortawesome/free-solid-svg-icons';

type Playlist = {
  id: number;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  firstVideo: string | null;
};

type NewPlaylist = {
  name: string;
  description: string;
};

type PlaylistProps = {
  id: string;
  clientId: string;
};

const Playlist = ({ id, clientId }: PlaylistProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selfUser, setSelfUser] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState<NewPlaylist>({ name: "", description: "" });

  useEffect(() => {
    fetchUserPlaylists(id);
  }, [id]);
  useEffect(()=>{
    if(id === clientId){
      setSelfUser(true)
    } else {
      setSelfUser(false)
    }
  }, [id, clientId])

  const fetchUserPlaylists = async (userId: string) => {
    try {
      const response = await api.get(`/playlist/user/${userId}`);
      setPlaylists(Array.isArray(response.data.video) ? response.data.video : []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    }
  };

  const handleCreatePlaylistClick = () => {
    setShowModal(true);
  };

  const handleSavePlaylist = async () => {
    try {
      const response = await api.post('/playlist', {
        name: newPlaylist.name,
        description: newPlaylist.description,
      });
      setPlaylists((prevPlaylists) => [...prevPlaylists, response.data.result]);
      setShowModal(false);
      setNewPlaylist({ name: "", description: "" });
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div>
      {selfUser?<button onClick={handleCreatePlaylistClick} className="create-playlist-button">
        Create Playlist
      </button>: ""}

      {showModal && (
        <Modal
          newPlaylist={newPlaylist}
          setNewPlaylist={setNewPlaylist}
          handleSavePlaylist={handleSavePlaylist}
          setShowModal={setShowModal}
        />
      )}

      <div className="playlist-container">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              {playlist.firstVideo && (
                <img src={playlist.firstVideo} alt="Playlist thumbnail" />
              )}
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
            </div>
          ))
        ) : (
          <p>No playlists available</p>
        )}
      </div>
    </div>
  );
};

type ModalProps = {
  newPlaylist: NewPlaylist;
  setNewPlaylist: React.Dispatch<React.SetStateAction<NewPlaylist>>;
  handleSavePlaylist: () => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({ newPlaylist, setNewPlaylist, handleSavePlaylist, setShowModal }: ModalProps) => (
  <div className="modal">
    <h2>Create New Playlist</h2>
    <input
      type="text"
      placeholder="Playlist Name"
      value={newPlaylist.name}
      onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
    />
    <input
      type="text"
      placeholder="Playlist Description"
      value={newPlaylist.description}
      onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
    />
    <button onClick={handleSavePlaylist}>Save</button>
    <button onClick={() => setShowModal(false)}>Cancel</button>
  </div>
);

export default Playlist;

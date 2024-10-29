// Sidebar.tsx
import React from 'react';
import '../styles/component_styles/sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faThumbsUp, faHistory, faVideo, faFolder, faUserFriends, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const buttons:{
    label: string,
    icon: IconDefinition,
    path: string
  }[] = [
    { label: "Home", icon: faHome, path:"/" },
    { label: "Liked Videos", icon: faThumbsUp, path:"/" },
    { label: "History", icon: faHistory, path:"/" },
    { label: "My Content", icon: faVideo, path:"/" },
    { label: "Collection", icon: faFolder, path:"/" },
    { label: "Subscribers", icon: faUserFriends, path:"/" }
  ];
  const navigate = useNavigate()

  return (
    <div className="sidebar">
      <div className="sidebar-buttons">
        {buttons.map((button, index) => (
          <button key={index} className="sidebar-button" onClick={()=>navigate(button.path)}>
            <FontAwesomeIcon icon={button.icon} className="sidebar-icon" />
            <span>{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

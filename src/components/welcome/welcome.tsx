import { useState, useEffect } from 'react';
import './welcome.css'; 

const Welcome = () => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowImage(true);
    }, 200); 
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh', 
  };

  const imageStyle = {
    width: 400,
  };

  return (
    <div style={containerStyle}>
      {showImage && (
        <img src="/logoIcon.png" alt="" style={{ ...imageStyle, animation: 'fadeIn 1s ease' }} className="fade-in" />
      )}
    </div>
  );
};

export default Welcome;

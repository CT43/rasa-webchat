import React from 'react';
import PropTypes from 'prop-types';

import close from 'assets/clear-button.svg';
import fullscreen from 'assets/fullscreen_button.svg';
import fullscreenExit from 'assets/fullscreen_exit_button.svg';
import './style.scss';

const Header = ({
  title,
  subtitle,
  colorTheme,
  fullScreenMode,
  toggleFullScreen,
  toggleChat,
  showCloseButton,
  showFullScreenButton,
  connected,
  connectingText,
  closeImage,
  profileAvatar
}) => {
  const headerColor = (colorTheme) = {
    backgroundColor: `${colorTheme}`
  };

  return (
    <div className="rw-header-and-loading">
      <div className={`rw-header ${subtitle ? 'rw-with-subtitle' : ''}`} style={headerColor}>
        {
          profileAvatar && (
            <img src={profileAvatar} className="rw-avatar" alt="chat avatar" />
          )
        }
        <h4 className={`rw-title ${profileAvatar && 'rw-with-avatar'}`}>{title}</h4>
        {subtitle && <span className={profileAvatar && 'rw-with-avatar'}>{subtitle}</span>}
      </div>
      {
        !connected &&
        <span className="rw-loading">
          {connectingText}
        </span>
      }
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  fullScreenMode: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string,
  profileAvatar: PropTypes.string
};

export default Header;

// Previous window size buttontop left

// <div className="rw-header-buttons">
//   {
//     showFullScreenButton &&
//     <button className="rw-toggle-fullscreen-button" onClick={toggleFullScreen} style={headerColor}>
//       <img
//         className={`rw-toggle-fullscreen ${fullScreenMode ? 'rw-fullScreenExitImage' : 'rw-fullScreenImage'}`}
//         src={fullScreenMode ? fullscreenExit : fullscreen}
//         alt="toggle fullscreen"
//       />
//     </button>
//   }
//   {
//     showCloseButton &&
//     <button className="rw-close-button" onClick={toggleChat} style={headerColor}>
//       <img
//         className={`rw-close ${closeImage ? '' : 'rw-default'}`}
//         src={closeImage || close}
//         alt="close"
//       />
//     </button>
//   }
// </div>

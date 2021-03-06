import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { MESSAGES_TYPES } from 'constants';
import { Image, Message, QuickReply } from 'messagesComponents';
import { showTooltip as showTooltipAction } from 'actions';
import openLauncher from 'assets/launcher_button.svg';
import closeIcon from 'assets/clear-button-grey.svg';
import close from 'assets/clear-button.svg';
import Badge from './components/Badge';
import chatWidgetDefaultDark1 from 'assets/chat_widget_default_dark_1.svg';
import chatWidgetMinimizeDark1 from 'assets/chat_widget_minimize_dark.svg';
import chatWidgetMinimizeLightMenu from 'assets/chat_widget_minimize_light_menu.svg'
import chatWidgetNotificationDark from 'assets/chat_widget_notification_dark.svg'
import chatWidgetNotificationDarkAnim from 'assets/chat_widget_notification_dark_anim.svg'

import './style.scss';


const Launcher = ({
  toggle,
  isChatOpen,
  badge,
  fullScreenMode,
  openLauncherImage,
  closeImage,
  unreadCount,
  displayUnreadCount,
  showTooltip,
  lastMessage,
  closeTooltip,
  colorTheme
}) => {
  const className = ['rw-launcher'];
  if (isChatOpen) className.push('rw-hide-sm');
  if (fullScreenMode) className.push(`rw-full-screen${isChatOpen ? '  rw-hide' : ''}`);


  const getComponentToRender = (message) => {
    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.QUICK_REPLY: {
          return QuickReply;
        }
        default:
          return null;
      }
    })();
    // debugger
    if (message.get('type') === 'quickreply') {
      return <ComponentToRender id={-1} params={{}} message={message} isLast toggleme={toggle} ischatopen={isChatOpen} />;
    }
    return <ComponentToRender id={-1} params={{}} message={message} isLast />;
  };


  const renderToolTip = () => (
    <div className="rw-tooltip-body">
      <div className="rw-tooltip-close" >
          <img onClick={(e) => { e.stopPropagation(); closeTooltip(); }}
            src={chatWidgetMinimizeLightMenu}
            className="minimize-light-menu"
            alt="close"
          />
      </div>
      <div className="rw-tooltip-response">
        {getComponentToRender(lastMessage)}
      </div>
      <div className="rw-tooltip-decoration" />
    </div>
  );



  const renderOpenLauncherImage = () => (
    <div>
    { showTooltip ? (
      <div className='rw-tooltip-launcher rw-launcher '>
        <span className="inner-ring"></span>
        <span className="outer-ring"></span>
        <img
          src={chatWidgetDefaultDark1 || chatWidgetDefaultDark1} onClick={toggle}
          className={` rw-launcher-open no-warp-in-launcher ${chatWidgetDefaultDark1 ? '' : 'rw-launcher'}`}
          alt=""
        />
      </div>
    ) : (
      <img
        src={chatWidgetDefaultDark1 || chatWidgetDefaultDark1} onClick={toggle}
        className={`rw-launcher rw-launcher-open ${chatWidgetDefaultDark1 ? '' : 'rw-launcher'} ${showTooltip ? 'rw-tooltip-launcher' : ''}`}
        alt=""
      />
    )}
    {showTooltip && lastMessage.get('sender') === 'response' && renderToolTip()}
      </div>
  );

  const launcherColor = (colorTheme) = {
    backgroundColor: `${colorTheme}`
  };

  return (
    <div className="rw-launcher">
    { isChatOpen ? (
      <img
        src={chatWidgetMinimizeDark1 || chatWidgetMinimizeDark1} onClick={toggle}
        className={`rw-launcher rw-launcher-min ${chatWidgetMinimizeDark1 ? '' : 'rw-launcher'}`}
        alt=""
      />
    ) : (
      renderOpenLauncherImage()
    )}
    </div>

  );
};

Launcher.propTypes = {
  toggle: PropTypes.func,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  fullScreenMode: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  unreadCount: PropTypes.number,
  displayUnreadCount: PropTypes.bool,
  showTooltip: PropTypes.bool,
  lastMessage: ImmutablePropTypes.map,
  colorTheme: PropTypes.string
};

const mapStateToProps = state => ({
  lastMessage: (state.messages && state.messages.get(-1)) || new Map(),
  unreadCount: state.behavior.get('unreadCount') || 0,
  showTooltip: state.metadata.get('showTooltip'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  closeTooltip: () => dispatch(showTooltipAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);

// Original launcher button

// <button type="button" className={className.join(' ')} onClick={toggle} style={launcherColor}>
//   <Badge badge={badge} />
//   {isChatOpen ? (
//
//     <img
//       src={closeImage || close}
//       className={`rw-close-launcher ${closeImage ? '' : 'rw-default'}`}
//       alt=""
//     />
//   ) : (
//     renderOpenLauncherImage()
//   )}
// </button>

// Original renderOpenLauncherImage
// <div className="rw-open-launcher__container">
//   {unreadCount > 0 && displayUnreadCount && (
//     <div className="rw-unread-count-pastille">{unreadCount}</div>
//   )}
//   <img src={openLauncherImage || openLauncher} className="rw-open-launcher" alt="" />
//   {showTooltip && lastMessage.get('sender') === 'response' && renderToolTip()}
// </div>

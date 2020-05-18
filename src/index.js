import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Cable from 'actioncable';
import uuid from 'react-uuid';


import { connect } from 'react-redux';
import Widget from './components/Widget';
import { initStore } from '../src/store/store';
import socket from './socket';
import { storeLocalSession, getLocalSession } from './store/reducers/helper';
import {
  toggleFullScreen,
  toggleChat,
  openChat,
  closeChat,
  showChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addCarousel,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  renderCustomComponent,
  initialize,
  connectServer,
  disconnectServer,
  pullSession,
  newUnreadMessage,
  triggerMessageDelayed,
  triggerTooltipSent,
  showTooltip,
  emitMessageIfFirst,
  clearMetadata,
  setUserInput,
  setLinkTarget,
  setPageChangeCallbacks,
  changeOldUrl,
  setDomHighlight,
  evalUrl,
  setCustomCss,
  setConvoUnqId,
  getConvoUnqId,
  createEvents,
  getEvents
} from 'actions';

// eslint-disable-next-line import/no-mutable-exports
export let store = null;

const ConnectedWidget = forwardRef((props, ref) => {


  class Socket {
    constructor(
      url,
      customData,
      path,
      protocol,
      protocolOptions,
      onSocketEvent,
      convo_unq_id
    ) {
      this.url = 'ws://localhost:3000/cable';
      this.customData = customData;
      this.path = '/cable';
      this.protocol = protocol;
      this.protocolOptions = protocolOptions;
      this.onSocketEvent = onSocketEvent;
      this.socket = null;
      this.onEvents = [];
      this.marker = Math.random();
      this.convo_unq_id = uuid();
      this.chatLogs = [];
    }

    isInitialized() {
      return this.socket !== null && this.socket.connected;
    }

    on(event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.on(event, callback);
      }
    }

    emit(message, data) {
      if (this.socket) {
        this.socket.emit(message, data);
      }
    }

    close() {
      if (this.socket) {
        this.socket.close();
      }
    }

    // createSocket() {
    //   let cable = Cable.createConsumer('ws://localhost:3000/cable');
    //   this.chats = cable.subscriptions.create({
    //     channel: 'ConversationsChannel', convo_unq_id: this.convo_unq_id
    //   }, {
    //     connected: () => {},
    //     received: (data) => {
    //
    //       let chatLogs = this.chatLogs;
    //       chatLogs.push(JSON.parse(data));
    //       this.chatLogs = chatLogs
    //     },
    //     create: function(chatContent) {
    //       this.perform('create', {
    //         content: chatContent
    //       });
    //     }
    //   });
    // }
    createSocket() {
      this.socket = socket(
        this.url,
        this.customData,
        this.path,
        this.protocol,
        this.protocolOptions
      );
      // We set a function on session_confirm here so as to avoid any race condition
      // this will be called first and will set those parameters for everyone to use.
      this.socket.on('session_confirm', (sessionObject) => {
        this.sessionConfirmed = true;
        this.sessionId = (sessionObject && sessionObject.session_id)
          ? sessionObject.session_id
          : sessionObject;
      });
      this.onEvents.forEach((event) => {
        this.socket.on(event.event, event.callback);
      });

      this.onEvents = [];
      Object.keys(this.onSocketEvent).forEach((event) => {
        this.socket.on(event, this.onSocketEvent[event]);
      });
    }
  }

  const new_uuid = uuid()


  class Sock {
    constructor(
      url,
      customData,
      path,
      protocol,
      protocolOptions,
      onSocketEvent,
      convo_unq_id
    ) {
      this.url = 'ws://localhost:3000/cable';
      this.customData = customData;
      this.path = '/cable';
      this.protocol = protocol;
      this.protocolOptions = protocolOptions;
      this.onSocketEvent = onSocketEvent;
      this.socket = null;
      this.onEvents = [];
      this.marker = Math.random();
      this.convo_unq_id = uuid();
      this.chatLogs = [];
    }
    /////////////// Below are what get called to then call that on the socket (CABLE) in createSocket
    isInitialized() {
      return this.socket;
    }

    on(event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.on(event, callback);
      }
    }

    emit(message, data) {
      if (this.socket) {
        this.socket.emit(message, data);
      }
    }

    close() {
      if (this.socket) {
        this.socket.close();
      }
    }

    createEvent(sockle, event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.createEvent(sockle, event, callback);
      }
    }

    // createSocket() {
    //   let cable = Cable.createConsumer('ws://localhost:3000/cable');
    //   this.chats = cable.subscriptions.create({
    //     channel: 'ConversationsChannel', convo_unq_id: this.convo_unq_id
    //   }, {
    //     connected: () => {},
    //     received: (data) => {
    //
    //       let chatLogs = this.chatLogs;
    //       chatLogs.push(JSON.parse(data));
    //       this.chatLogs = chatLogs
    //     },
    //     create: function(chatContent) {
    //       this.perform('create', {
    //         content: chatContent
    //       });
    //     }
    //   });
    // }

    // Alright this is where everything functionality wise starts
    // on all but received - you can pass in the sock object itself to save data but received you cant since it's coming from api
    // solution to this is storing the event that seems to start it all - bot utterence - in redux store, then pulling it out and executing it
    // will likely have to do this with other shit
    createSocket(sockle) {
       this.socket = Cable.createConsumer('ws://localhost:3000/cable').subscriptions.create({
          channel: 'ConversationsChannel', convo_unq_id: new_uuid, sockle: sockle
        }, {
          connected: function() {
            store.dispatch(setConvoUnqId(new_uuid))
          },
          received: function(data) {
            let eve = store.getState('created_events').metadata
            let handlebu = eve._root.entries[7][1]
            debugger
            if (handlebu['bot_uttered']) {
              handlebu['bot_uttered'](JSON.parse(data).message)
            } else {
              handlebu(JSON.parse(data).message)
            }
            // store.dispatch(addResponseMessage(JSON.parse(data).message.text))
            // let chatLogs = this.chatLogs;
            // chatLogs.push(JSON.parse(data));
            // this.chatLogs = chatLogs
          },
          create: function(chatContent) {
            this.perform('create', {
              content: chatContent
            });
          },
          createSocket: () => {},
          createEvent: (sockle, eventName, callback) => {
            store.dispatch(createEvents(eventName, callback))
          },
          on: (event, callback) => {
            return "lalala"
          },
          close: () => {},
          emit: function(message) {
            this.perform('create', {
              content: message
            });
          }
        });
      // We set a function on session_confirm here so as to avoid any race condition
      // this will be called first and will set those parameters for everyone to use.
      this.socket.on('session_confirm', (sessionObject) => {
        this.sessionConfirmed = true;
        this.sessionId = (sessionObject && sessionObject.session_id)
          ? sessionObject.session_id
          : sessionObject;
      });
      this.onEvents.forEach((event) => {
        this.socket.on(event.event, event.callback);
      });
      //
      this.onEvents = [];
      // Object.keys(this.onSocketEvent).forEach((event) => {
      //   this.socket.on(event, this.onSocketEvent[event]);
      // });
    }
  }

  // .subscriptions.create({
  //   channel: 'ConversationsChannel', convo_unq_id: new_uuid
  // }, {
  //   connected: function() {
  //     store.dispatch(setConvoUnqId(new_uuid))
  //   },
  //   received: (data) => {
  //     store.dispatch(addResponseMessage(JSON.parse(data).message.text))
  //
  //     // let chatLogs = this.chatLogs;
  //     // chatLogs.push(JSON.parse(data));
  //     // this.chatLogs = chatLogs
  //   },
  //   create: function(chatContent) {
  //     this.perform('create', {
  //       content: chatContent
  //     });
  //   },
  //   createSocket: () => {},
  //   on: (event, callback) => {
  //     "botUttered"
  //   },
  //   close: () => {},
  //   emit: function(message) {
  //     this.perform('create', {
  //       content: message
  //     });
  //   }
  // });


  const sock = new Sock(
    props.socketUrl,
    props.customData,
    // props.socketPath,
    // props.protocol,
    // props.protocolOptions,
    // props.onSocketEvent
  );

  const storage =
    props.params.storage === 'session' ? sessionStorage : localStorage;
  if (!store || sock.marker !== store.socketRef) {
    store = initStore(
      props.inputTextFieldHint,
      props.connectingText,
      sock,
      storage,
      props.docViewer,
      props.onWidgetEvent
    );
    store.socketRef = sock.marker;
  }
  return (
    <Provider store={store}>
      <Widget
        ref={ref}
        initPayload={props.initPayload}
        title={props.title}
        subtitle={props.subtitle}
        customData={props.customData}
        handleNewUserMessage={props.handleNewUserMessage}
        profileAvatar={props.profileAvatar}
        showCloseButton={props.showCloseButton}
        showFullScreenButton={props.showFullScreenButton}
        hideWhenNotConnected={props.hideWhenNotConnected}
        connectOn={props.connectOn}
        autoClearCache={props.autoClearCache}
        fullScreenMode={props.fullScreenMode}
        badge={props.badge}
        embedded={props.embedded}
        params={props.params}
        storage={storage}
        openLauncherImage={props.openLauncherImage}
        closeImage={props.closeImage}
        customComponent={props.customComponent}
        displayUnreadCount={props.displayUnreadCount}
        socket={sock}
        newuuid={new_uuid}
        showMessageDate={props.showMessageDate}
        customMessageDelay={props.customMessageDelay}
        tooltipPayload={props.tooltipPayload}
        tooltipDelay={props.tooltipDelay}
        disableTooltips={props.disableTooltips}
        defaultHighlightCss={props.defaultHighlightCss}
        defaultHighlightAnimation={props.defaultHighlightAnimation}
        defaultHighlightClassname={props.defaultHighlightClassname}
      />
    </Provider>
  );
});

ConnectedWidget.propTypes = {
  convo_unq_id: PropTypes.string,
  initPayload: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  protocol: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  socketPath: PropTypes.string,
  protocolOptions: PropTypes.shape({}),
  customData: PropTypes.shape({}),
  handleNewUserMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  connectingText: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  connectOn: PropTypes.oneOf(['mount', 'open']),
  autoClearCache: PropTypes.bool,
  onSocketEvent: PropTypes.objectOf(PropTypes.func),
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  embedded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  docViewer: PropTypes.bool,
  customComponent: PropTypes.func,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  customMessageDelay: PropTypes.func,
  tooltipPayload: PropTypes.string,
  tooltipDelay: PropTypes.number,
  onWidgetEvent: PropTypes.shape({
    onChatOpen: PropTypes.func,
    onChatClose: PropTypes.func,
    onChatVisible: PropTypes.func,
    onChatHidden: PropTypes.func
  }),
  disableTooltips: PropTypes.bool,
  defaultHighlightCss: PropTypes.string,
  defaultHighlightAnimation: PropTypes.string
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  customData: {},
  inputTextFieldHint: 'Type a message...',
  connectingText: 'Waiting for server...',
  fullScreenMode: false,
  hideWhenNotConnected: true,
  autoClearCache: false,
  connectOn: 'mount',
  onSocketEvent: {},
  protocol: 'socketio',
  socketUrl: 'http://localhost',
  protocolOptions: {},
  badge: 0,
  embedded: false,
  params: {
    storage: 'local'
  },
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false,
  customMessageDelay: (message) => {
    let delay = message.length * 30;
    if (delay > 3 * 1000) delay = 3 * 1000;
    if (delay < 800) delay = 800;
    return delay;
  },
  tooltipPayload: null,
  tooltipDelay: 500,
  onWidgetEvent: {
    onChatOpen: () => {},
    onChatClose: () => {},
    onChatVisible: () => {},
    onChatHidden: () => {}
  },
  disableTooltips: false
};

export default ConnectedWidget;

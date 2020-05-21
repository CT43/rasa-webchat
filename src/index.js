import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Cable from 'actioncable';
import uuid from 'react-uuid';


import { connect } from 'react-redux';
import Widget from './components/Widget';
import { initStore } from '../src/store/store';
// import socket from './socket';
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


  // class Socket {
  //   constructor(
  //     url,
  //     customData,
  //     path,
  //     protocol,
  //     protocolOptions,
  //     onSocketEvent,
  //     convo_session_uid
  //   ) {
  //     this.url = 'ws://localhost:3000/cable';
  //     this.customData = customData;
  //     this.path = '/cable';
  //     this.protocol = protocol;
  //     this.protocolOptions = protocolOptions;
  //     this.onSocketEvent = onSocketEvent;
  //     this.socket = null;
  //     this.onEvents = [];
  //     this.marker = Math.random();
  //     this.convo_session_uid = uuid();
  //     this.chatLogs = [];
  //   }
  //
  //   isInitialized() {
  //     return this.socket !== null && this.socket.connected;
  //   }
  //
  //   on(event, callback) {
  //     if (!this.socket) {
  //       this.onEvents.push({ event, callback });
  //     } else {
  //       this.socket.on(event, callback);
  //     }
  //   }
  //
  //   emit(message, data) {
  //     if (this.socket) {
  //       this.socket.emit(message, data);
  //     }
  //   }
  //
  //   close() {
  //     if (this.socket) {
  //       this.socket.close();
  //     }
  //   }
  //
  //   // createSocket() {
  //   //   let cable = Cable.createConsumer('ws://localhost:3000/cable');
  //   //   this.chats = cable.subscriptions.create({
  //   //     channel: 'ConversationsChannel', convo_session_uid: this.convo_session_uid
  //   //   }, {
  //   //     connected: () => {},
  //   //     received: (data) => {
  //   //
  //   //       let chatLogs = this.chatLogs;
  //   //       chatLogs.push(JSON.parse(data));
  //   //       this.chatLogs = chatLogs
  //   //     },
  //   //     create: function(chatContent) {
  //   //       this.perform('create', {
  //   //         content: chatContent
  //   //       });
  //   //     }
  //   //   });
  //   // }
  //   createSocket() {
  //     this.socket = socket(
  //       this.url,
  //       this.customData,
  //       this.path,
  //       this.protocol,
  //       this.protocolOptions
  //     );
  //     // We set a function on session_confirm here so as to avoid any race condition
  //     // this will be called first and will set those parameters for everyone to use.
  //     this.socket.on('session_confirm', (sessionObject) => {
  //       this.sessionConfirmed = true;
  //       this.sessionId = (sessionObject && sessionObject.session_id)
  //         ? sessionObject.session_id
  //         : sessionObject;
  //     });
  //     this.onEvents.forEach((event) => {
  //       this.socket.on(event.event, event.callback);
  //     });
  //
  //     this.onEvents = [];
  //     Object.keys(this.onSocketEvent).forEach((event) => {
  //       this.socket.on(event, this.onSocketEvent[event]);
  //     });
  //   }
  // }

  let new_uuid = uuid()


  class Sock {
    constructor(
      url,
      customData,
      path,
      protocol,
      protocolOptions,
      onSocketEvent,
      convo_session_uid
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
      this.convo_session_uid = uuid();
      this.chatLogs = [];
      this.created_events = []
    }
    /////////////// Below are what get called to then call that on the socket (CABLE) in createSocket
    isInitialized() {

      return this.socket !== null && this.socket.connected
      // return this.socket;
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

    createEvent(event, callback) {
      if (!this.socket) {
        this.onEvents.push({ event, callback });
      } else {
        this.socket.createEvent(event, callback);
      }
    }

    sessionRequest(localId) {
      if (this.socket) {
        this.socket.session_request(localId)
      }
    }

    // createSocket() {
    //   let cable = Cable.createConsumer('ws://localhost:3000/cable');
    //   this.chats = cable.subscriptions.create({
    //     channel: 'ConversationsChannel', convo_session_uid: this.convo_session_uid
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
    createSocket() {
      // Get rid of below if you don't want to persist the convo_session_uid on a page reload during dev
      // Later when dealing with PII and acct info you will need to either have convo_session_uid expire on time limit or revalidate
      if (localStorage.getItem('convo_session_uid') !== null) {
        new_uuid = localStorage.getItem('convo_session_uid')
      }
       this.socket = Cable.createConsumer('ws://localhost:3000/cable').subscriptions.create({
          channel: 'ConversationsChannel', convo_session_uid: new_uuid
        }, {
          connected: function() {
            let cui = JSON.parse(this.identifier).convo_session_uid
            store.dispatch(setConvoUnqId(cui))

            if (localStorage.getItem('convo_session_uid') !== cui) { // If it's a new session preform client initialized for the greeting
              this.perform('client_initialized')
            }

            localStorage.setItem('convo_session_uid', cui)

            let created_events = store.getState().viCreatedEvents

            // if (created_events["session_confirm"]) {
            //   created_events["session_confirm"](cui)
            // }

          },
          received: function(data) {
            let parsed_data = JSON.parse(data)
            let msg_format_attrs = parsed_data.message.msg_format_attr
            let who_uttered = msg_format_attrs.who_uttered

            let created_events = store.getState().viCreatedEvents

            if (who_uttered && who_uttered === "bot_uttered" && created_events[`${who_uttered}`]) {
              created_events[`${who_uttered}`](JSON.parse(data).message) // This is sending the event to "bot_uttered which was set in the index widget file"
            }

            // msg_format_attrs.forEach(function(format_attr) => { // Maybe worth it depending
            //
            // })

          },
          // Make a this.perform('session request thing')
          createEvent: (eventName, callback) => {
            store.dispatch(createEvents(eventName, callback))
          },
          on: (event, callback) => {
            return true
          },
          // close: () => {},
          emit: function(message, data) {
            this.perform('create', {
              content: message
            });
          }
        });
      // We set a function on session_confirm here so as to avoid any race condition
      // this will be called first and will set those parameters for everyone to use.

      this.socket.on('session_confirm', (sessionObject) => { // These don't do anything for ActionCable config
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
  //   channel: 'ConversationsChannel', convo_session_uid: new_uuid
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

  // function saveToLocalStorage(state) {
  //   try {
  //     debugger
  //     const serializedState = JSON.stringify(state)
  //     localStorage.setItem('convo_session_uid', serializedState)
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }
  //
  // function loadFromLocalStorage() {
  //   try {
  //     const serializedState = localStorage.getItem('convo_session_uid')
  //     if (serializedState === null) return undefined
  //     return JSON.parse(serializedState)
  //   } catch(e) {
  //     console.log(e)
  //     return undefined
  //   }
  // }

  // const persistedState = loadFromLocalStorage()


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

    // store.subscribe(() => saveToLocalStorage({convo_session_uid: store.getState().metadata.convo_session_uid}))
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
  convo_session_uid: PropTypes.string,
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

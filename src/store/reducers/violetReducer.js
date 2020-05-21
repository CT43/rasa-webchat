import { List, fromJS } from 'immutable';
import { MESSAGE_SENDER, SESSION_NAME } from 'constants';

import {
  createQuickReply,
  createNewMessage,
  createCarousel,
  createVideoSnippet,
  createImageSnippet,
  createComponentMessage,
  storeMessageTo,
  storeParamsTo,
  getLocalSession
} from './helper';

import * as actionTypes from '../actions/actionTypes';

export default function (storage) {
  const initialState = [];

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);
    switch (action.type) {
      // Each change to the redux store's message list gets recorded to storage
      case actionTypes.CREATE_EVENTS: {
        state[action.eventName] = action.callback

        // return storeMetadata(state.set('created_events', {[action.eventName]: action.callback}));
      }
      case actionTypes.GET_EVENTS: {

        // return (state.get('created_events'))
      }
      default:
        return state;
    }
  };
}

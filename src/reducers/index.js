import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types'

const initialUserState = {
  currentUser: null,
  isLoading: true
}

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      }
    
    default:
      return state;
  }
}

const initialVideosState = {
  videosList: null
}

const videos_reducer = (state = initialVideosState, action) => {
  switch (action.type) {
    case actionTypes.SET_VIDEOS:
      return {
        videosList: action.payload.videos
      }
    
    case actionTypes.CLEAR_VIDEOS:
      return {
        ...state
      }
    
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: user_reducer,
  videos: videos_reducer
})

export default rootReducer


import * as actionTypes from './types'

// User Actions
export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  }
}

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  }
}

//Video Actions
export const setVideos = videos => {
  return {
    type: actionTypes.SET_VIDEOS,
    payload: {
      videos: videos
    }
  }
}

export const clearVideos = () => {
  return {
    type: actionTypes.CLEAR_VIDEOS
  }
}
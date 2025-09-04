import { combineReducers } from 'redux'

import appReducer from './app/reducer'
import dataVisualization from './dataVisualization/reducer'
import inventoryReducer from './inventory/reducer'
import jobsReducer from './jobs/reducer'
import userReducer from './user_management/reducer'
import { LOGOUT } from '../utils/constant'
import { isEqual } from '../utils/javascript'

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  dataVisualization,
  jobs: jobsReducer,
  inventory: inventoryReducer,
})

const reducer = (state, action) => {
  if (isEqual(action.type, LOGOUT)) {
    state = undefined
  }
  return rootReducer(state, action)
}

export default reducer

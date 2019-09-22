import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import intl from './intl'
import account from './account'

export default combineReducers({
  router,
  form,
  intl,
  account
})

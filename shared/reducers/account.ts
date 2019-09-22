import { handleActions } from 'utils/redux-actions'
import * as actions from 'actions/account'

const initialState = {
  isLoggedIn: false
}

export default handleActions({
  [actions.login] (state: any) {
    state.isLoggedIn = true
  }
}, initialState)

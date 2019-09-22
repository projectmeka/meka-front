import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as accountActions from 'actions/account'
import style from './style.css'


@connect(
  state => ({
    account: state.account
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...accountActions,
    }, dispatch)
  })
)

export default class Home extends Component {
  login = () => {
    this.props.actions.login()
  }

  render() {
    const { account } = this.props

    return (
      <div className={style.home}>
        <div className={style.particlesContainer}>
          <div className={style.particles}>
            <img alt="particles" src={require('resources/images/particles.png')} />
          </div>
        </div>
        {!(account && account.isLoggedIn) && <div className={style.login}>
          <div className={style.title}>
            <span>Login with your social account.</span>
          </div>
          <div className={style.socialButtons}>
            <a /* href="http://5279521c.ngrok.io/api/auth/instagram" */ onClick={this.login}>
              <img alt="instagram" src={require('resources/images/instagram.png')} />
            </a>
            <a>
              <img alt="facebook" src={require('resources/images/facebook.png')} />
            </a>
            <a>
              <img alt="twitter" src={require('resources/images/twitter.png')} />
            </a>
            <a>
              <img alt="linkedin" src={require('resources/images/linkedin.png')} />
            </a>
          </div>
        </div>}
        {account && account.isLoggedIn && <div className={style.accountInfo}>
          <h1>Welcome to Meka!</h1>
          <a>My Account</a>
        </div>}
      </div>
    )
  }
}

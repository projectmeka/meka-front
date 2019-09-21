import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import style from './style.css'

export default class Home extends Component {
  render() {
    return (
      <div className={style.home}>
        <div className={style.particlesContainer}>
          <div className={style.particles}>
            <img alt="particles" src={require('resources/images/particles.png')} />
          </div>
        </div>
        <div className={style.login}>
          <div className={style.title}>
            <span>Login with your social account.</span>
          </div>
          <div className={style.socialButtons}>
            <a href="http://cb174c25.ngrok.io/api/auth/instagram">
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
        </div>
      </div>
    )
  }
}

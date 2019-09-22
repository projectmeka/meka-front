import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import 'normalize.css/normalize.css'
import 'resources/fonts/fonts.css'
import Title from 'components/DocumentTitle'
import storage from 'utils/storage'
import * as api from 'utils/api'
// import { ApiPromise, WsProvider } from '@polkadot/api'
import style from './style.css'

const messages = require('./messages.json')

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => (routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={props => (<route.component {...props} {...extraProps} route={route} />)}
      />
    ))}
  </Switch>
) : null)

@connect(
  state => ({
    locale: state.intl.locale,
    account: state.account
  })
)

export default class App extends Component {
  state = {
    userInfo: {
      _id: '5d8624f354df23af153eebeb',
      updatedAt: '2019-09-21T13:26:11.380Z',
      createdAt: '2019-09-21T13:26:11.380Z',
      email: 'terencege2.0@instagram.com',
      instagram: 20743606306,
      profile: {
        picture: 'https://instagram.faep3-1.fna.fbcdn.net/vp/d3bb6c5a07d43fc6ba44d73f83b12a67/5E1A41F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.faep3-1.fna.fbcdn.net',
        website: '',
        name: 'Terence Ge'
      },
      tokens: [
        {
          kind: 'instagram',
          accessToken: '20743606306.6398a76.e5950fa1a9294743aea0072ceacd6be7'
        }
      ]
    }
  }

  async componentDidMount() {
    const token = storage.getItemSync('meka_token')
    console.log(token)
    if (token) {
      const userInfo = await api.getUserInfo()
      console.log(userInfo)

      if (userInfo && typeof userInfo === 'object') {
        this.setState({ userInfo }) // eslint-disable-line react/no-did-mount-set-state
      }
    }

    /* const wsProvider = new WsProvider('ws://poc-3.polkadot.io')
     * const pkApi = await ApiPromise.create({ provider: wsProvider })
     * await pkApi.isReady

     * console.log(pkApi.genesisHash.toHex()) */
    this.startLogin()
  }

  startLogin = () => {
    this.setState({
      userInfo: {
        _id: '5d8624f354df23af153eebeb',
        updatedAt: '2019-09-21T13:26:11.380Z',
        createdAt: '2019-09-21T13:26:11.380Z',
        email: 'terencege2.0@instagram.com',
        instagram: 20743606306,
        profile: {
          picture: 'https://instagram.faep3-1.fna.fbcdn.net/vp/d3bb6c5a07d43fc6ba44d73f83b12a67/5E1A41F1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.faep3-1.fna.fbcdn.net',
          website: '',
          name: 'Terence Ge'
        },
        tokens: [
          {
            kind: 'instagram',
            accessToken: '20743606306.6398a76.e5950fa1a9294743aea0072ceacd6be7'
          }
        ]
      }
    })
  }

  render() {
    const { locale, route, account } = this.props

    return (
      <IntlProvider messages={messages[locale]}>
        <div className={style.app}>
          <Title render="Meka" />
          <div className={style.appContainer}>
            <div className={style.transitionBackground} />
            <div className={style.navBar}>
              <Link to="/" className={style.branding}>
                <img alt="logo" src={require('resources/images/logo.png')} />
              </Link>
              <div className={style.accountInfo}>
                {account && account.isLoggedIn && <div className={style.profile}>
                  <div>
                    <img alt="avatar" src={require('resources/images/avatar-test.jpg')} />
                  </div>
                  <span className={style.name}>{this.state.userInfo.profile.name}</span>
                </div>}
              </div>
            </div>
            <div className={style.transitionContext}>
              <div className={style.content}>
                {renderRoutes(route.routes)}
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    )
  }
}

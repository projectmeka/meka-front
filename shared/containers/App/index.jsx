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
  (state: any) => ({
    locale: state.intl.locale
  })
)

export default class App extends Component {
  async componentDidMount() {
    const token = storage.getItemSync('meka_token')
    if (token) {
      const userInfo = await api.getUserInfo()
      console.log(userInfo)
    }
  }

  render() {
    const { locale, route } = this.props

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

import App from 'containers/App'
import NoMatch from 'components/NoMatch'
import {
  Home,
  Oauth
} from 'routes/sync'

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home
      },
      {
        path: '/oauth',
        exact: true,
        component: Oauth
      },
      {
        path: '*',
        component: NoMatch
      }
    ]
  }
]

export default routes

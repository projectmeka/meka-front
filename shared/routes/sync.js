import { syncComponent } from 'components/DynamicComponent'

export const Home = syncComponent('Home', require('containers/App/Home'))
export const Oauth = syncComponent('Oauth', require('containers/App/Oauth'))

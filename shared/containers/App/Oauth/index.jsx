import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import queryString from 'query-string'
import storage from 'utils/storage'
import style from './style.css'

@connect(
  () => ({}),
  dispatch => ({
    actions: bindActionCreators({
      push,
    }, dispatch)
  })
)

export default class Oauth extends Component {
  componentDidMount() {
    const { location } = this.props
    if (location && location.search) {
      const query = queryString.parse(location.search)
      if (query && query.access_token) {
        storage.setItem('meka_token', query.access_token)
        this.props.actions.push('/')
      }
    }
  }

  render() {
    return (
      <div className={style.oauth}>
        Hello
      </div>
    )
  }
}

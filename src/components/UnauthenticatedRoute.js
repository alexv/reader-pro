import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function querystring(name, url = window.location.href) {
  const safeName = name.replace(/[[]]/g, '\\$&')

  const regex = new RegExp(`[?&]${safeName}(=([^&#]*)|&|#|$)`, 'i')
  const results = regex.exec(url)

  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const UnauthenticatedRoute = ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring('redirect')
  return (
    <Route
      {...rest}
      render={props =>
        !cProps.isAuthenticated ? (
          <C {...props} {...cProps} />
        ) : (
          <Redirect
            to={redirect === '' || redirect === null ? '/' : redirect}
          />
        )
      }
    />
  )
}

UnauthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  props: PropTypes.shape({}).isRequired
}

export default UnauthenticatedRoute

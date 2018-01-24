import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

import Home from './containers/Home'
import Login from './containers/Login'
import Feeds from './containers/Feeds'
import Signup from './containers/Signup'
import NewFeed from './containers/NewFeed'
import NotFound from './containers/NotFound'

const Routes = ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={Signup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/feeds/new"
      exact
      component={NewFeed}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/feeds/:id"
      exact
      component={Feeds}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
)

Routes.propTypes = {
  childProps: PropTypes.shape({}).isRequired
}

export default Routes

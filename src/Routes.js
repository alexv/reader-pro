import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import asyncComponent from './components/AsyncComponent'
import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

const AsyncHome = asyncComponent(() => import('./containers/Home'))
const AsyncLogin = asyncComponent(() => import('./containers/Login'))
const AsyncNotes = asyncComponent(() => import('./containers/Notes'))
const AsyncSignup = asyncComponent(() => import('./containers/Signup'))
const AsyncNewNote = asyncComponent(() => import('./containers/NewNote'))
const AsyncNotFound = asyncComponent(() => import('./containers/NotFound'))

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
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={Notes}
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

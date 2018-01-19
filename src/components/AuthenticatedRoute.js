import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (cProps.isAuthenticated ? (
        <C {...props} {...cProps} />
      ) : (
        <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
      ))
    }
  />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  props: PropTypes.shape({}).isRequired,
};

export default AuthenticatedRoute;

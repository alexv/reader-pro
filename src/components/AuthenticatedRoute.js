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
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  props: PropTypes.shape({}).isRequired,
};

AuthenticatedRoute.defaultProps = {
  location: {},
};

export default AuthenticatedRoute;

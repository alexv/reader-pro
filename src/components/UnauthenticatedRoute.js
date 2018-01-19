import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props => (!cProps.isAuthenticated ? <C {...props} {...cProps} /> : <Redirect to="/" />)}
  />
);

UnauthenticatedRoute.propTypes = {
  component: PropTypes.element.isRequired,
  props: PropTypes.shape({}).isRequired,
};

export default UnauthenticatedRoute;

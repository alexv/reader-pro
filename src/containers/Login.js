import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

import './Login.css';
import config from '../config';
import Portal from '../components/Portal';
import LoaderButton from '../components/LoaderButton';

function login(email, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID,
  });
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authenticationData = { Username: email, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: () => resolve(),
      onFailure: err => reject(err),
    }));
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      showModal: false,
      modalContent: '',
      email: '',
      password: '',
    };
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.email.indexOf('@') !== -1 &&
      this.state.password.length > 0
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      this.setState({
        showModal: true,
        modalContent: 'Incorrect username or password.',
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl value={this.state.password} onChange={this.handleChange} type="password" />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
        <Portal
          header="Login"
          open={this.state.showModal}
          onClose={() =>
            this.setState({
              showModal: false,
            })
          }
        >
          <h1>Content: {this.state.modalContent}</h1>
        </Portal>
      </div>
    );
  }
}

Login.propTypes = {
  userHasAuthenticated: PropTypes.func.isRequired,
};

export default Login;

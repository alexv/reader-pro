import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

import './Signup.css';
import config from '../config';
import LoaderButton from '../components/LoaderButton';

function signup(email, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID,
  });

  return new Promise((resolve, reject) =>
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.user);
    }));
}

function confirm(user, confirmationCode) {
  return new Promise((resolve, reject) =>
    user.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    }));
}

function authenticate(user, email, password) {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: () => resolve(),
      onFailure: err => reject(err),
    }));
}

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
    };

    this.validateForm = this.validateForm.bind(this);
    this.validateConfirmationForm = this.validateConfirmationForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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
      const newUser = await signup(this.state.email, this.state.password);
      this.setState({
        newUser,
      });
    } catch (e) {
      alert(e); //eslint-disable-line
    }

    this.setState({ isLoading: false });
  }

  async handleConfirmationSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await confirm(this.state.newUser, this.state.confirmationCode);
      await authenticate(this.state.newUser, this.state.email, this.state.password);

      this.props.userHasAuthenticated(true);
      this.props.history.push('/');
    } catch (e) {
      alert(e); //eslint-disable-line
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}
      </div>
    );
  }
}

Signup.propTypes = {
  userHasAuthenticated: PropTypes.func.isRequired,
  history: PropTypes.shape({
    location: PropTypes.array,
    push: PropTypes.func,
  }).isRequired,
};

export default Signup;

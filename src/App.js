import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './App.css'
import Routes from './Routes'
import RouteNavItem from './components/RouteNavItem'
import { authUser, signOutUser } from './libs/awsLibs'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    }
    this.userHasAuthenticated = this.userHasAuthenticated.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true)
      }
    } catch (e) {
      alert(e) // eslint-disable-line
    }
    this.setState({ isAuthenticating: false })
  }

  userHasAuthenticated(authenticated) {
    this.setState({ isAuthenticated: authenticated })
  }

  handleLogout() {
    signOutUser()
    this.userHasAuthenticated(false)
    this.props.history.push('/login')
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Reader Pro</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                {this.state.isAuthenticated ? (
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                ) : (
                  [
                    <RouteNavItem key={1} href="/signup">
                      Signup
                    </RouteNavItem>,
                    <RouteNavItem key={2} href="/login">
                      Login
                    </RouteNavItem>
                  ]
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    )
  }
}

App.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.object,
    push: PropTypes.func
  }).isRequired
}

export default withRouter(App)

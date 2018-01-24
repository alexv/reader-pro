import React, { Component } from 'react'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './NewFeed.css'
import { invokeApig } from '../libs/awsLibs'
import LoaderButton from '../components/LoaderButton'

function createFeed(feed) {
  return invokeApig({
    path: '/feeds',
    method: 'POST',
    body: feed
  })
}

class NewFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: null,
      feedName: '',
      feedUrl: ''
    }
    this.validateForm = this.validateForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  validateForm() {
    return this.state.feedName.length > 0 && this.state.feedUrl.length > 0
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await createFeed({
        feedName: this.state.feedName,
        feedUrl: this.state.feedUrl
      })
      this.props.history.push('/')
    } catch (e) {
      alert(e)
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <div className="NewFeed">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="feedName">
            <ControlLabel>Name:</ControlLabel>
            <FormControl
              type="text"
              value={this.state.feedName}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="feedUrl">
            <ControlLabel>RSS URL:</ControlLabel>
            <FormControl
              type="text"
              value={this.state.feedUrl}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Add"
            loadingText="Adding…"
          />
        </form>
      </div>
    )
  }
}

NewFeed.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.object,
    push: PropTypes.func
  }).isRequired
}

export default NewFeed

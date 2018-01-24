import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl } from 'react-bootstrap'

import './Feeds.css'
import { invokeApig } from '../libs/awsLibs'
import LoaderButton from '../components/LoaderButton'

class Feeds extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: null,
      isDeleting: null,
      feed: null,
      feedName: ''
    }

    this.validateForm = this.validateForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async componentDidMount() {
    try {
      const results = await this.getFeed()
      this.setState({
        feed: results,
        feedName: results.feedName
      })
    } catch (e) {
      alert(e)
    }
  }

  getFeed() {
    return invokeApig({ path: `/feeds/${this.props.match.params.id}` })
  }

  validateForm() {
    return this.state.feedName.length > 0
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  saveFeed(feed) {
    return invokeApig({
      path: `/feeds/${this.props.match.params.id}`,
      method: 'PUT',
      body: feed
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await this.saveFeed({
        ...this.state.feed,
        feedName: this.state.feedName
      })
      this.props.history.push('/')
    } catch (e) {
      alert(e)
      this.setState({ isLoading: false })
    }
  }

  deleteFeed() {
    return invokeApig({
      path: `/feeds/${this.props.match.params.id}`,
      method: 'DELETE'
    })
  }

  async handleDelete(event) {
    event.preventDefault()

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    )

    if (!confirmed) {
      return
    }

    this.setState({ isDeleting: true })

    try {
      await this.deleteFeed()
      this.props.history.push('/')
    } catch (e) {
      alert(e)
      this.setState({ isDeleting: false })
    }
  }

  render() {
    return (
      <div className="Feeds">
        {this.state.feed && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="feedName">
              <FormControl
                onChange={this.handleChange}
                value={this.state.feedName}
                componentClass="textarea"
              />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    )
  }
}

Feeds.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

export default Feeds

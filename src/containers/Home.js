import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './Home.css'
import { invokeApig } from '../libs/awsLibs'

function feeds() {
  return invokeApig({ path: '/feeds' })
}

function renderLander() {
  return (
    <div className="lander">
      <h1>Reader Pro</h1>
      <p>An RSS reader that works.</p>
      <div>
        <Link to="/login" className="btn btn-info btn-lg">
          Login
        </Link>
        <Link to="/signup" className="btn btn-success btn-lg">
          Signup
        </Link>
      </div>
    </div>
  )
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      feeds: []
    }
    this.handleFeedClick = this.handleFeedClick.bind(this)
    this.renderFeeds = this.renderFeeds.bind(this)
    this.renderFeedsList = this.renderFeedsList.bind(this)
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return
    }
    try {
      const results = await feeds()
      this.setState({ feeds: results })
    } catch (e) {
      alert(e)
    }
    this.setState({ isLoading: false })
  }

  handleFeedClick(event) {
    event.preventDefault()
    this.props.history.push(event.currentTarget.getAttribute('href'))
  }

  renderFeedsList(allFeeds) {
    return [{}].concat(allFeeds).map(
      (feed, i) =>
        i !== 0 ? (
          <ListGroupItem
            key={feed.feedId}
            href={`/feeds/${feed.feedId}`}
            onClick={this.handleFeedClick}
            header={feed.feedName.trim().split('\n')[0]}
          >
            {`Created: ${new Date(feed.createdAt).toLocaleString()}`}
          </ListGroupItem>
        ) : (
          <ListGroupItem
            key="new"
            href="/feeds/new"
            onClick={this.handleFeedClick}
          >
            <h4>
              <b>{'\uFF0B'}</b> Add a new feed
            </h4>
          </ListGroupItem>
        )
    )
  }

  renderFeeds() {
    return (
      <div className="feeds">
        <PageHeader>Your Feeds</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderFeedsList(this.state.feeds)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderFeeds() : renderLander()}
      </div>
    )
  }
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    location: PropTypes.object,
    push: PropTypes.func
  }).isRequired
}

export default Home

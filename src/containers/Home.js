import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Home.css';
import { invokeApig } from '../libs/awsLibs';

function notes() {
  return invokeApig({ path: '/feeds' });
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
  );
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notes: [],
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.renderNotes = this.renderNotes.bind(this);
    this.renderNotesList = this.renderNotesList.bind(this);
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      const results = await notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  handleNoteClick(event) {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderNotesList(allNotes) {
    return [{}].concat(allNotes).map((note, i) =>
      (i !== 0 ? (
        <ListGroupItem
          key={note.feedId}
          href={`/notes/${note.feedId}`}
          onClick={this.handleNoteClick}
          header={note.content.trim().split('\n')[0]}
        >
          {`Created: ${new Date(note.createdAt).toLocaleString()}`}
        </ListGroupItem>
      ) : (
        <ListGroupItem key="new" href="/notes/new" onClick={this.handleNoteClick}>
          <h4>
            <b>{'\uFF0B'}</b> Create a new note
          </h4>
        </ListGroupItem>
      )));
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Feeds</PageHeader>
        <ListGroup>{!this.state.isLoading && this.renderNotesList(this.state.notes)}</ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">{this.props.isAuthenticated ? this.renderNotes() : renderLander()}</div>
    );
  }
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    location: PropTypes.object,
    push: PropTypes.func,
  }).isRequired,
};

export default Home;

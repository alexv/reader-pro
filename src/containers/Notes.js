import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './Notes.css';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import LoaderButton from '../components/LoaderButton';

function formatFilename(str) {
  return str.length < 50
    ? str
    : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;
}

class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: '',
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getNote();
      this.setState({
        note: results,
        content: results.content,
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return invokeApig({ path: `/notes/${this.props.match.params.id}` });
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleFileChange(event) {
    [this.file] = event.target.files;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });
  }

  async handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this note?');

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
  }

  render() {
    return (
      <div className="Notes">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.attachment && (
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a target="_blank" rel="noopener noreferrer" href={this.state.note.attachment}>
                    {formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            )}
            <FormGroup controlId="file">
              {!this.state.note.attachment && <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
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
    );
  }
}

Notes.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default Notes;

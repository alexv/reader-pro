import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import './Notes.css'
import { invokeApig } from '../libs/awsLibs'
import LoaderButton from '../components/LoaderButton'

function formatFilename(str) {
  return str.length < 50
    ? str
    : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`
}

class Notes extends Component {
  constructor(props) {
    super(props)

    this.file = null

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: ''
    }

    this.validateForm = this.validateForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async componentDidMount() {
    try {
      const results = await this.getNote()
      this.setState({
        note: results,
        content: results.content
      })
    } catch (e) {
      alert(e)
    }
  }

  getNote() {
    return invokeApig({ path: `/feeds/${this.props.match.params.id}` })
  }

  validateForm() {
    return this.state.content.length > 0
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleFileChange(event) {
    ;[this.file] = event.target.files
  }

  saveNote(note) {
    return invokeApig({
      path: `/feeds/${this.props.match.params.id}`,
      method: 'PUT',
      body: note
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await this.saveNote({
        ...this.state.note,
        content: this.state.content
      })
      this.props.history.push('/')
    } catch (e) {
      alert(e)
      this.setState({ isLoading: false })
    }
  }

  deleteNote() {
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
      await this.deleteNote()
      this.props.history.push('/')
    } catch (e) {
      alert(e)
      this.setState({ isDeleting: false })
    }
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
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.note.attachment}
                  >
                    {formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            )}
            <FormGroup controlId="file">
              {!this.state.note.attachment && (
                <ControlLabel>Attachment</ControlLabel>
              )}
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
    )
  }
}

Notes.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

export default Notes

import userEvent from '@testing-library/user-event'
import React from 'react'
import { Modal, Form, Input, Button, Icon } from 'semantic-ui-react'
import firebase from '../../firebase'

class AddVideoModal extends React.Component {

  state = {
    videoTitle: '',
    videoTopic: '',
    videoLink: '',
    videoRefs: firebase.database().ref('videos')
  }

  handleChange = e => this.setState({[e.target.name]: e.target.value})

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid(this.state)) {
      this.addVideo()
    }
  }
  
  isFormValid = ({ videoTitle, videoTopic, videoLink }) => videoTitle && videoTopic && videoLink
  
  addVideo = () => {
    const { videoTitle, videoLink, videoRefs, videoTopic } = this.state
    const {closeModal, user} = this.props
  
    const newVideo = {
      id: videoLink.split('v=').pop().split('&')[0],
      videoTitle,
      videoLink,
      videoTopic,
      uploadedBy: {
        name: user.name,
        avatar: user.avatar
      },
      uploadedOn: firebase.database.ServerValue.TIMESTAMP,
      views: 0
    }
  
    videoRefs
      .child(newVideo.id)
      .update(newVideo)
      .then(() => {
        this.setState({ videoTitle: '', videoLink: '', videoTopic: '' })
        closeModal()
        console.log('video added')
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    const { open, closeModal } = this.props
    const { videoTitle, videoLink, videoTopic } = this.state
    return (
      <Modal basic open={open} onClose={closeModal}>
        <Modal.Header>Upload a Video</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
          <Form.Field>
              <Input
                fluid
                label="Video Topic/Category"
                name="videoTopic"
                value={videoTopic}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                
                label="Video Title"
                name="videoTitle"
                value={videoTitle}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="Video Link"
                name="videoLink"
                value={videoLink}
                onChange={this.handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.handleSubmit}>
            <Icon name="checkmark"/> Upload
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
    
      </Modal>
    )
  }
}

export default AddVideoModal
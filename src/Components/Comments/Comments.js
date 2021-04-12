import React from 'react'
import { Segment, Comment, Form, Button, Header } from 'semantic-ui-react'

import firebase from '../../firebase'
import SingleComment from './SingleComment'

class Comments extends React.Component {
  state = {
    commentsRef: firebase.database().ref("comments"),
    currentVideo: this.props.currentVideo,
    user: this.props.user,
    comments: [],
    comment: '',
    commentsLoading: true,
    commentLoading: false,
    errors: []
  }

  componentDidMount() {
    const { currentVideo, user } = this.state
    if (currentVideo && user) {
      this.addCommentsListeners(currentVideo.id)
    }
  }

  addCommentsListeners = videoId => {
    let loadedComments = []
    this.state.commentsRef.child(videoId).on('child_added', snap => {
      loadedComments.push(snap.val())
      this.setState({
        comments: loadedComments,
        commentsLoading: false
      })
    })
  }

  createComment = () => {
    const comment = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      comment: this.state.comment
    }
    return comment
  }

  displayComments = comments => (
    comments.length > 0 && comments.map(comment => (
      <SingleComment comment={comment} user={this.state.user} key={comment.timestamp}/>
    ))
  )

  addComment = () => {
    const { comment, currentVideo, commentsRef } = this.state
    if (comment) {
      this.setState({ commentLoading: true })
      commentsRef
        .child(currentVideo.id)
        .push()
        .set(this.createComment())
        .then(() => {
          console.log("success")
          this.setState({ commentLoading: false, comment: '', errors: [] })
        })
        .catch(err => {
          console.log("error")
          console.log(err)
          this.setState({
            commentLoading: false,
            errors: this.state.errors.concat(err)
          })
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a comment" })
      })
    }
  }

  handleChange = (e) => this.setState({comment: e.target.value})

  render() {
    const { currentVideo, user, comments, comment } = this.state
    return (
      <React.Fragment>
        <Comment.Group threaded>
          <Header as='h3' dividing>
            Comments
          </Header>
          {this.displayComments(comments)}
          <Form reply onSubmit={this.addComment }>
            <Form.TextArea value={comment} onChange={this.handleChange}/>
            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
          </Form>
        </Comment.Group>

      {/* <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user}/> */}
      </React.Fragment>
    )
  }
}

export default Comments;
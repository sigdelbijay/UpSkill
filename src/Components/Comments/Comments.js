import React from 'react'
import { Segment, Comment, Form, Button, Header } from 'semantic-ui-react'

import firebase from '../../firebase'
import SingleComment from './SingleComment'

class Comments extends React.Component {
  state = {
    commentsRef: firebase.database().ref("comments"),
    currentVideoId: this.props.currentVideoId,
    user: this.props.user,
    comments: [],
    comment: '',
    commentsLoading: true,
    commentLoading: false,
    errors: []
  }

  componentDidMount() {
    const { currentVideoId, user } = this.state
    if (currentVideoId && user) {
      this.addCommentsListeners(currentVideoId)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentVideoId !== this.props.currentVideoId) { //prevProps.currentVideo || this.state.currentVideo
      this.setState({currentVideoId: this.props.currentVideoId})
      this.addCommentsListeners(this.props.currentVideoId)
    }
  }

  addCommentsListeners = videoId => {
    let loadedComments = []
    this.state.commentsRef.child(videoId).on('value', snap => {
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
        name: this.state.user.name,
        avatar: this.state.user.avatar
      },
      comment: this.state.comment
    }
    return comment
  }

  addComment = () => {
    const { comment, currentVideoId, commentsRef } = this.state
    if (comment) {
      this.setState({ commentLoading: true })
      commentsRef
        .child(currentVideoId)
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

  handleChange = (e) => this.setState({ comment: e.target.value })
  
  displayComments = comments => {
    //firebase returns if no comments are found and returns an extra array for every new child added
    //so better to take the last array
    return comments.length > 0 && comments[0] !== null && Object.values(comments[comments.length - 1]).map(comment => {
      return comment !== null && <SingleComment comment={comment} user={this.state.user} key={comment.timestamp}/>
    })
  }

  render() {
    const { comments, comment } = this.state
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
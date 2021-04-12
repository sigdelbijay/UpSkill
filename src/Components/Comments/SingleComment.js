import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'

const isOwnMessage = (comment, user) => comment.user.id === user.uid ? 'comment__self' : ''
const timeFromNow = timestamp => moment(timestamp).fromNow()

const SingleComment = ({ comment, user }) => (
  <Comment>
    <Comment.Avatar src={comment.user.avatar} />
    <Comment.Content className={isOwnMessage(comment, user)}>
      <Comment.Author as="a">{comment.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(comment.timestamp)}</Comment.Metadata>
      <Comment.Text>{comment.comment}</Comment.Text>
      
    </Comment.Content>
  </Comment>

)

export default SingleComment
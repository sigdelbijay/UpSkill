import React from 'react';
import { Grid, Image, Header, Label, Segment, Card, Icon, Divider } from 'semantic-ui-react'
import './App.css';
import { connect } from 'react-redux'
import firebase from '../firebase'
import ReactPlayer from 'react-player'
import UserPanel from './Main Panel/UserPanel';

class App extends React.Component {
  state = {
    displayName: this.props.currentUser.displayName,
    photoUrl: this.props.currentUser.photoURL,
    role: '',
    videos: [],
    videosRef: firebase.database().ref('videos')
  }

  componentDidMount() {
    firebase.database().ref('users')
      .child(this.props.currentUser.uid).once('value').then(snap => snap.val())
      .then(val => this.setState({ role: val.role }))
    
      this.state.videosRef.once('value').then(snap => snap.val())
      .then(val => this.setState({ videos: val }))
  }

  addViewCount(video) {
    this.state.videosRef.child(video.id).set({...video, views: video.views+1})
  }
  
  render() {
    const { videos } = this.state
    return (
      <React.Fragment>

        <Segment basic>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <UserPanel user={this.state} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Divider/>
        <Segment basic style={{ padding: '2em 0em' }} vertical>
          <Header>Videos</Header>
          <Grid>
            {videos &&
              <Grid.Row columns={3}>
                {videos && Object.values(videos).slice(0,3).map((video, i) => (
                  <Grid.Column >
                    <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink} onStart={() => this.addViewCount(video)} />
                    <Card.Content>
                      <Card.Header ><Header>{video.videoTitle}</Header></Card.Header>
                      <Card.Meta>
                        <span className='date'>Uploaded by { video.uploadedBy.name}</span>
                      </Card.Meta>
                      <Label>{video.videoTopic || 'topic'}</Label>
                    </Card.Content>
                  </Grid.Column>
                ))}
              </Grid.Row>
            }
          </Grid>
        </Segment>
        <Segment basic style={{ padding: '4em 0em' }} vertical>
          <Header>Popular Videos</Header>
          <Grid>
            <Grid.Row columns={3}>
              {videos && Object.values(videos)
                .sort((a, b) => b.views - a.views).slice(0, 3).map((video, i) => (
                  <Grid.Column >
                    <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink} onStart={() => this.addViewCount(video)} />
                    <Card.Content>
                      <Card.Header ><Header>{video.videoTitle}</Header></Card.Header>
                      <Card.Meta>
                        <span className='date'>Uploaded by { video.uploadedBy.name}</span>
                      </Card.Meta>
                      <Label>{video.videoTopic || 'topic'}</Label>
                    </Card.Content>
                  </Grid.Column>
                ))
              }
            </Grid.Row>
          </Grid>
          
        </Segment>
        <Segment basic style={{ padding: '1em 0em' }} vertical>
          <Header>Latest Videos</Header>
          <Grid>
            <Grid.Row columns={3}>
              {videos && Object.values(videos)
                .sort((a, b) => a.uploadedOn - b.uploadedOn).slice(0, 3).map((video, i) => (
                  <Grid.Column >
                    <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink} onStart={() => this.addViewCount(video)} />
                    <Card.Content>
                      <Card.Header ><Header>{video.videoTitle}</Header></Card.Header>
                      <Card.Meta>
                        <span className='date'>Uploaded by { video.uploadedBy.name}</span>
                      </Card.Meta>
                      <Label>{video.videoTopic || 'topic'}</Label>
                    </Card.Content>
                  </Grid.Column>
                ))
              }
            </Grid.Row>
          </Grid>
        </Segment>
        <br />
        <br />
        <br/>
        <Segment  inverted vertical style={{ padding: '1em 0em' }}>
        <Header as='h5' textAlign='right' >© UpSkill, 2021. All rights reserved.</Header>

        </Segment>  
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App);

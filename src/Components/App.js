import React from 'react';
import { Grid, Image, Header, Label, Segment, Card, Icon, Divider } from 'semantic-ui-react'
import './App.css';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import firebase from '../firebase'
import ReactPlayer from 'react-player'
import UserPanel from './Main Panel/UserPanel'
import { setUser, setVideos } from '../actions'


class App extends React.Component {
  state = {
    user: {
      uid: this.props.currentUser.uid,
      displayName: this.props.currentUser.displayName,
      photoURL: this.props.currentUser.photoURL,
      role: ''
    },
    videos: [],
    videosRef: firebase.database().ref('videos')
  }

  // state = {
  //   displayName: this.props.currentUser.displayName,
  //   photoUrl: this.props.currentUser.photoURL,
  //   role: '',
  //   videos: [],
  //   videosRef: firebase.database().ref('videos')
  // }

  componentDidMount() {
    firebase.database().ref('users')
      .child(this.state.user.uid).once('value').then(snap => snap.val())
      .then(val => {
        this.setState({ user: { ...this.state.user, role: val.role } })
        this.props.setUser({ ...this.state.user, role: val.role })
      })
      .catch(err => {
        console.log(err)
      })
    // .then(val => this.setState({ role: val.role }))
  
    this.state.videosRef.once('value').then(snap => snap.val())
      .then(val => {
        this.setState({ videos: val })
        this.props.setVideos(val)
      })
  }

  // addViewCount(video) {
  //   this.state.videosRef.child(video.id).set({...video, views: video.views+1})
  // }
  
  render() {
    const { user, videos } = this.state
    return (
      <React.Fragment>
        <Segment basic style={{padding: '1em 0em' }}>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <UserPanel user={user} videos={videos} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Divider hidden/>
        <Segment vertical>
          <Header>Videos</Header>
          <Grid>
            {videos &&
              <Grid.Row columns={3}>
                {videos && Object.values(videos).slice(0,3).map((video, i) => (
                  <Grid.Column key={video.id}>
                    {/* <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink}  onClickPreview={() => this.addViewCount(video)} /> */}

                    <Link to={`/video/${video.id}`}>
                      <Image
                        src={`http://img.youtube.com/vi/${video.videoLink.split('v=').pop().split('&')[0]}/0.jpg`}
                        width="95%" height="70%" 
                      />
                    </Link>
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

        <Divider hidden clearing/>
        <Segment vertical>
          <Header>Popular Videos</Header>
          <Grid>
            <Grid.Row columns={3}>
              {videos && Object.values(videos)
                .sort((a, b) => b.views - a.views).slice(0, 3).map((video, i) => (
                  <Grid.Column key={video.id}>
                    {/* <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink} onStart={() => this.addViewCount(video)} /> */}
                    <Link to={`/video/${video.id}`}>
                      <Image
                        src={`http://img.youtube.com/vi/${video.videoLink.split('v=').pop().split('&')[0]}/0.jpg`}
                        width="95%" height="70%" 
                      />
                    </Link>
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
        <Divider hidden clearing/>

        <Segment vertical>
          <Header>Latest Videos</Header>
          <Grid>
            <Grid.Row columns={3}>
              {videos && Object.values(videos)
                .sort((a, b) => a.uploadedOn - b.uploadedOn).slice(0, 3).map((video, i) => (
                  <Grid.Column key={video.id}>
                    {/* <ReactPlayer controls width="95%" height="95%" controls
                      url={video.videoLink} onStart={() => this.addViewCount(video)} /> */}
                    <Link to={`/video/${video.id}`}>
                      <Image
                        src={`http://img.youtube.com/vi/${video.videoLink.split('v=').pop().split('&')[0]}/0.jpg`}
                        width="95%" height="70%" 
                      />
                    </Link>
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

        <Segment  inverted vertical>
        <Header as='h5' textAlign='right' >© UpSkill, 2021. All rights reserved.</Header>

        </Segment>  
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  videos: state.videos.videosList
})

export default connect(mapStateToProps, {setUser, setVideos})(App);

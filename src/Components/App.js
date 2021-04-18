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
      name: this.props.currentUser.displayName || this.props.currentUser.name,
      avatar: this.props.currentUser.photoURL || this.props.currentUser.avatar,
      role: this.props.currentUser.role || '',
      favourites: this.props.currentUser.favourites || []
    },
    videos: this.props.videos || [],
    videosRef: firebase.database().ref('videos'),
    showFavourites: false
  }

  componentDidMount() {
    const {user, videos, videosRef} = this.state
    if (!user.role) {

      firebase.database().ref('users')
      .child(user.uid).once('value').then(snap => snap.val())
        .then(val => {
        console.log("val", val)
        this.setState({ user: { ...user, role: val.role, favourites: val.favourites ? Object.values(val.favourites) : [] } })
        this.props.setUser({ ...user, role: val.role, favourites: val.favourites ? Object.values(val.favourites) : [] })
      })
      .catch(err => {
        console.log(err)
      })
    }

    if (videos.length === 0) {
      videosRef.once('value').then(snap => snap.val())
      .then(val => {
        this.setState({ videos: val })
        this.props.setVideos(val)
      })
    }
  }

  showFavouritesFn = () => {
    console.log("clicked")
    this.setState({ showFavourites: !this.state.showFavourites })
  }
  
  render() {
    const { user, videos, favourites, showFavourites } = this.state
    console.log("showFavourites", showFavourites)
    return (
      <React.Fragment>
        <Segment basic style={{padding: '1em 0em' }}>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <UserPanel user={user} videos={videos} showFavouritesFn={this.showFavouritesFn}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        
        <Divider hidden/>
        {showFavourites &&
          <Segment vertical>
            <Header>Favourites</Header>
            <Grid>
              <Grid.Row columns={3}>
                {videos && Object.values(videos).filter(video => user.favourites.includes(video.id)).slice(0,3).map((video, i) => (
                  <Grid.Column key={video.id}>
                    <Link to={`/video/${video.id}`}>
                      <Image
                        src={`http://img.youtube.com/vi/${video.videoLink.split('v=').pop().split('&')[0]}/0.jpg`}
                        width="95%" height="70%"
                      />
                    </Link>
                    <Card.Content>
                      <Card.Header ><Header>{video.videoTitle}</Header></Card.Header>
                      <Card.Meta>
                        <span className='date'>Uploaded by {video.uploadedBy.name}</span>
                      </Card.Meta>
                      <Label>{video.videoTopic || 'topic'}</Label>
                    </Card.Content>
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </Segment>}
        
        <Segment vertical>
          <Header>Videos</Header>
          <Grid>
            {videos &&
              <Grid.Row columns={3}>
                {videos && Object.values(videos).slice(0,3).map((video, i) => (
                  <Grid.Column key={video.id}>
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

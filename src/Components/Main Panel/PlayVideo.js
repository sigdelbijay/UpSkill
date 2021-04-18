import React from 'react'
import ReactPlayer from 'react-player'
import { Segment, Grid, Divider, Card, Header, Label, Icon, Message, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Spinner from '../../Spinner'
import UserPanel from './UserPanel'
import Comments from '../Comments/Comments'
import firebase from '../../firebase'

class PlayVideo extends React.Component {
  state = {
    user: this.props.currentUser,
    videos: this.props.videos,
    currentVideoId: this.props.match.params.id,
    currentVideo: {},
    isAFavourite: false,
    isAFavouriteLoading: false,
    message: '',
    videosRef: firebase.database().ref('videos'),
    usersRef: firebase.database().ref('users')
  }

  componentDidMount() {
    const { videos, currentVideoId } = this.state
    if (videos && currentVideoId) {
      this.setState({currentVideo: this.getCurrentVideo(videos, currentVideoId)[0]})
    }
    this.checkFavourite(videos, currentVideoId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps === undefined) return false
    if (this.state.currentVideoId !== this.props.match.params.id) {
      this.setState({
        currentVideoId: this.props.match.params.id,
        currentVideo: this.getCurrentVideo(this.state.videos, this.props.match.params.id)[0]
      })
    }
  }

  // OR adding key in SearchVideo which will trigger the react component to remount
  // <Route path="/page/:pageid" render={(props) => (
  //   <Page key={props.match.params.pageid} {...props} />)
  // } />

  checkFavourite = (videos, currentVideoId) => {
    if (this.state.user.favourites.includes(videos[currentVideoId]))
      this.setState({ isAFavourite: true })
  }
  getCurrentVideo = (videos, currentVideoId) => Object.values(videos).filter(video => video.id === currentVideoId)
  addViewCount = (video) => this.state.videosRef.child(video.id).set({...video, views: video.views+1})

  addToFavorite = () => {
    this.setState({ message: '', isAFavouriteLoading: true})
    const { uid, name, avatar, role, favourites } = this.state.user
    const { usersRef, currentVideo, isAFavourite, message } = this.state
    usersRef.child(uid)
      .set({
        name, avatar, role,
        favourites: (isAFavourite ?
          favourites.filter(item => item !== currentVideo.id) : [...favourites, currentVideo.id])
      })
      .then(() => {
        this.setState({
          isAFavourite: !isAFavourite,
          isAFavouriteLoading: false,
          message: isAFavourite ? "removed from favourites": "added to favourites"
        })
      })
      .catch((err) => {
        this.setState({
          isAFavouriteLoading: false,
          message: err.message
        })

      })
  }
  // displayMessages = () => this.state.messages.map((msg, i) => <p key={i}>{msg.message}</p>)

  displayMessage = (message) => setTimeout(() => this.setState({ message: '' }), 1000)

  render() {
    const { user, videos, currentVideo, currentVideoId, isAFavourite, isAFavouriteLoading, message } = this.state
    message && this.displayMessage(message)
    return Object.keys(currentVideo).length === 0 ? <Spinner spinnerLabel="Loading Video..." /> : (
      <React.Fragment>
        <Segment basic>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <UserPanel user={user} videos={videos}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Divider/>

        <Segment vertical>
          <Grid>
            <Grid.Row columns={1} style={{paddingBottom: 0}}>
              <Grid.Column className='player-wrapper'>
                  <ReactPlayer
                    className='react-player'
                    controls
                    width='100%'
                    height='100%'
                    url={currentVideo.videoLink}
                    onClickPreview={() => this.addViewCount(currentVideo)}
                />

              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1} style={{paddingTop: 0}}>
              <Grid.Column >
                <Segment clearing basic style={{padding: 0, marginBottom:0}}>
                  <Header as='h3' style={{ fontSize: '1.8em', marginBottom: 0}} floated='left'>
                    {currentVideo.videoTitle} {" "}
                    <Icon inverted link name='like' size='tiny'
                      disabled={isAFavouriteLoading}
                      color={isAFavourite ? 'pink' : 'grey'}
                      onClick={() => this.addToFavorite(currentVideoId)} />                  
                  </Header>
                  {message && <Header as='h3' floated='right'
                    style={{
                      border: `1px solid ${isAFavourite ? 'green': 'red'}`,
                      color: `${isAFavourite ? 'green': 'red'}`,
                      padding: '2px'
                    }}>{message}</Header>}
                  
                </Segment>
                <p>
                  <Image avatar src={currentVideo.uploadedBy.avatar} />
                  <b>{currentVideo.uploadedBy.name}</b>
                  {/* {message && <Label basic floa>{message}</Label>} */}
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} >
              <Grid.Column >
                <Comments user={user} currentVideoId={currentVideoId} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </React.Fragment>
        
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  videos: state.videos.videosList
})

export default connect(mapStateToProps)(PlayVideo)
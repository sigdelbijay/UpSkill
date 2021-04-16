import React from 'react'
import ReactPlayer from 'react-player'
import { Segment, Grid, Divider, Card, Header, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Spinner from '../../Spinner'
import UserPanel from './UserPanel'
import Comments from '../Comments/Comments'

class PlayVideo extends React.Component {
  state = {
    user: this.props.currentUser,
    videos: this.props.videos,
    currentVideoId: this.props.match.params.id,
    currentVideo: {}
  }

  componentDidMount() {
    const { videos, currentVideoId } = this.state
    if (videos && currentVideoId) {
      this.setState({currentVideo: this.getCurrentVideo(videos, currentVideoId)[0]})
    }
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
  
  getCurrentVideo = (videos, currentVideoId) => Object.values(videos).filter(video => video.id === currentVideoId)

  render() {
    const { user, videos, currentVideo, currentVideoId } = this.state

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
            <Grid.Row columns={1}>
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
            <Grid.Row columns={1} >
              <Grid.Column >
              <Card.Content>
                  <Card.Header ><Header>{currentVideo.videoTitle}</Header></Card.Header>
                  <Card.Meta>
                  <Label as='a' image>
                    <img src={currentVideo.uploadedBy.avatar} />
                    {currentVideo.uploadedBy.name}
                  </Label>
                  </Card.Meta>
                </Card.Content>
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
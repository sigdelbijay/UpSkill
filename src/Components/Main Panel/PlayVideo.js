import React from 'react'
import ReactPlayer from 'react-player'
import { Segment, Grid, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Spinner from '../../Spinner'
import UserPanel from './UserPanel'
import Comments from '../Comments/Comments'

class PlayVideo extends React.Component {
  state = {
    user: this.props.currentUser,
    videos: this.props.videos
  }
  
  getCurrentVideo = videos => Object.values(videos).filter(video => video.id === this.props.match.params.id)

  render() {
    const { user, videos } = this.state
    const currentVideo = this.getCurrentVideo(videos)[0]

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
                <Comments user={user} currentVideo={currentVideo} />
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
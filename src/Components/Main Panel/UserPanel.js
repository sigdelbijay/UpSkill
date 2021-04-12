import React from 'react'
import { Dropdown, Segment, Header, Icon, Image, Button, Input, Menu, Visibility } from 'semantic-ui-react'
import firebase from '../../firebase'
import AddVideoModal from './AddVideoModal'
import SearchVideo from './SearchVideo'
import { Link } from 'react-router-dom'

class UserPanel extends React.Component {

  state = {
    modal: false,
    activeItem: '',
    topPassed: false
  }

  dropdownOptions = (user) => [
    {
      key: "user",
      text: <span>Signed in as <strong>{user && user.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ]

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("Signed out!"))
  }

  openModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })
  topPassed = () => this.setState({ topPassed: true })
  topPassedReverse = () => this.setState({topPassed: false})
  
  render() {
    const { user, videos } = this.props
    const { modal, activeItem, topPassed } = this.state
    console.log("topPassed", topPassed)
    
    return (
      <Visibility once={false} onTopPassed={this.topPassed} onTopPassedReverse={this.topPassedReverse}>
        <Menu secondary={!topPassed} fixed='top' inverted={topPassed}>
          <Menu.Item header position='left'>
            <Link to="/">
              <Menu.Header as='h2' floated='left'>
                <Icon name="puzzle piece" color="orange" size='large'/>
                  UpSkill
              </Menu.Header>
            </Link>
          </Menu.Item>

          <Menu.Menu position='right'>
            <Menu.Item>
              <SearchVideo videos={videos} />
            </Menu.Item>
            {user.role === "tutor" ? <Menu.Item onClick={() => alert('going live')}>Go live!</Menu.Item> : ""}
            {user.role === "tutor" ? <Menu.Item onClick={this.openModal}>Add Video</Menu.Item> : ""}
            {user.role === "user" ? <Menu.Item>Favourites</Menu.Item> : ""}
            <Menu.Item>
              <Dropdown direction="left"
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar/>
                    {user && user.displayName}
                  </span>
                }
                options = {this.dropdownOptions(user)}
              />
          </Menu.Item>
          <AddVideoModal open={modal} closeModal={this.closeModal} user={user}/>
          </Menu.Menu>
        </Menu>
      </Visibility>
    )
  }
}
export default UserPanel
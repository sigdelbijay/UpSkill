import React from 'react'
import { Dropdown, Segment, Header, Icon, Image, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'
import AddVideoModal from './AddVideoModal'
import { Link } from 'react-router-dom'
import SearchVideo from './SearchVideo'

class UserPanel extends React.Component {

  state = {
    modal: false
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: <span>Signed in as <strong>{this.props.user && this.props.user.displayName}</strong></span>,
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
  closeModal = () => this.setState({modal: false})

  render() {
    const { user } = this.props
    const {modal} = this.state
    return (
      <React.Fragment>
        <Header as='h2' floated='left'>
          <Icon name="puzzle piece" color="orange" />
            UpSkill
        </Header>
        <Header as="h4" floated="right">
          {/* <Link to="/test">test</Link> */}
          {" "}
          <Input action={{ icon: 'search'}} size='small' placeholder='Search...' />
          {/* <SearchVideo videos={user.videos}/> */}
          {" "}
          {user.role === "tutor" ? <Button negative onClick={() => alert('going live')}>Go live!</Button> : ""}
          {" "}
          {user.role === "tutor" ? <Button positive onClick={this.openModal}>Add Video</Button> : ""}
          {user.role === "user" ? <Button>Favourites</Button> : ""}
          {" "}
          <Dropdown direction="left"
            trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar/>
                {user && user.displayName}
              </span>
            }
            options = {this.dropdownOptions()}
          />
          <AddVideoModal open={modal} closeModal={this.closeModal} user={user}/>
        </Header>
      </React.Fragment>     
    )
  }
}
export default UserPanel
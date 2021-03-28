import React from 'react'
import { Dropdown, Segment, Header, Icon, Image, Button } from 'semantic-ui-react'
import firebase from '../../firebase'

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser
  }
  dropdownOptions = () => [
    {
      key: "user",
      text: <span>Signed in as <strong>{this.state.user && this.state.user.displayName}</strong></span>,
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

  render() {
    const { user } = this.state
    return (
      <React.Fragment>
        <Header as='h2' floated='left'>
            UpSkill
        </Header>
        <Header as="h4" floated="right">
          {user.role === 'tutor' && <Button>Add video</Button>}
          <Dropdown
            trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar/>
                {user && user.displayName}
              </span>
            }
            options = {this.dropdownOptions()}
          />
        </Header>
      </React.Fragment>     
    )
  }
}
export default UserPanel
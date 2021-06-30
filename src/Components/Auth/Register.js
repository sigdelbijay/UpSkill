import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'
import './../App.css'

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
  }

  handleChange = e => this.setState({[e.target.name]: e.target.value})

  isFormValid = () => {
    let errors = []
    let error
    if (this.isFormEmpty()) {
      //throw err
      error = { message: "Fill in all the fields" }
      this.setState({ errors: errors.concat(error) })
      return false;
    } else if (!this.isPasswordValid()) {
      //throw err
      error = { message: "Password is invalid" }
      this.setState({ errors: errors.concat(error) })
      return false;
    } else {
      return true
    }
  }

  isFormEmpty = () => {
    const { username, email, password, confirmPassword, role } = this.state
    return !username.length || !email.length || !password.length || !confirmPassword.length || !role.length
  }

  isPasswordValid = () => {
    const { password, confirmPassword } = this.state
    if (password.length < 6 || confirmPassword.length < 6) return false
    else if (password !== confirmPassword) return false
    else return true
  }

  displayErrors = () => this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      role: this.state.role
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (!this.isFormValid()) return
    this.setState({errors: [], loading: true})
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser)
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
              role: this.state.role
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved')
              })
            })
            .catch(err => {
              console.log(err)
              this.setState({errors: this.state.errors.concat(err), loading: false, role: ''})
            })

        })
        .catch(err => {
          console.log(err)
          this.setState({errors: this.state.errors.concat(err), loading: false, role: ''})
        })
  }

  render() {

    //destructuring
    const { username, email, password, confirmPassword, role, errors, loading } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" textAlign="center">
            <span className="upskill-grey"><small>Register to</small></span><br/>
            <span className="upskill-logo">UpSkill</span>
          </Header>
          <br/>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors()}
            </Message>
          )}
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input fluid name="username" icon="user" iconPosition="left"
                placeholder="Username" value={username} onChange={this.handleChange} type="text" />
              <Form.Input fluid name="email" icon="mail" iconPosition="left"
                placeholder="Email Address" value={email} onChange={this.handleChange} type="email" />
              <Form.Input fluid name="password" icon="lock" iconPosition="left"
                placeholder="Password" value={password} onChange={this.handleChange} type="password" />
              <Form.Input fluid name="confirmPassword" icon="repeat" iconPosition="left"
                placeholder="Confirm Password" value={confirmPassword} onChange={this.handleChange} type="password" />
              <Form.Group inline>
                <Icon name="male" disabled/>
                <label>Role</label>
                <Form.Field label='User' control='input' type='radio' name="role" value='user' checked={role === 'user'} onChange={this.handleChange} />
                <Form.Field label='Tutor' control='input' type='radio' name="role" value='tutor' checked={role === 'tutor'} onChange={this.handleChange} />
              </Form.Group>
              <Button disabled={loading} color="blue" fluid size="large">
                {loading ? <Loader active inline='centered' size="mini"/> : 'REGISTER'}
                </Button>
            </Segment>
          </Form>
          <Message>Already an user? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';

import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom"
import firebase from './firebase'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'
import TestLayout from './Components/Test/TestLayout'
import PlayVideo from './Components/Main Panel/PlayVideo'

//redux for storing data globally
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { setUser, clearUser } from './actions'
import Spinner from './Spinner'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends React.Component {
  componentDidMount() {
    console.log(this.props.isLoading)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.props.setUser(user)
        this.props.history.push("/")
      } else {
        this.props.history.push("/login")
        this.props.clearUser()
      }
    })
  }
  render() {
    return this.props.isLoading ? <Spinner spinnerLabel="Preparing Dashborad..."/> : (
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/test" component={TestLayout} />
          <Route path="/video/:id" component={PlayVideo} />
        </Switch>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth/>
    </Router>
  </Provider>
  , document.getElementById('root'))
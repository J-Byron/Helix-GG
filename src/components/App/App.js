// *----------* Create App *----------*
import React, { Component } from 'react';
import './App.css';

// *----------* Router *----------*
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Page Components *----------*
import Nav from '../Nav/Nav';
import HomePage from '../HomePage/HomePage'
import Footer from '../Footer/Footer';

// Consider Deleting
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' })
  }

  render() {
    return (
      <Router>
        <div>
        <Nav />
          <Switch>
            {/* Nav will need access to profile route */}

            {/* Visiting localhost:3000 will redirect to localhost:3000/home*/}
            <Redirect exact from="/" to="/home" />

            {/* Visiting /home will render the homepage component, regardless if logged in */}
            <Route path='/home' component={HomePage} />

            {/* Visiting /Search (after a search) will render the search page  */}
            <Route path='/Search' component={() => { }} />

            {/* Visiting /search will result in an error page, otherwise it will render the profile page of the user */}
            <ProtectedRoute path='/profile' component={() => { }} />

          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default connect()(App);

{/*
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home 
              
            <Redirect exact from="/" to="/home" />
            Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary 

            <Route
              exact
              path="/about"
              component={AboutPage}
            />
            
            For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home 

            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            
             This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. 
            
            <ProtectedRoute
              exact
              path="/info"
              component={InfoPage}
            />
            */}
{/* If none of the other routes matched, we will show a 404. 
            <Route render={() => <h1>404</h1>} />
          </Switch>
          */}
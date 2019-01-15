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
import SummonerPage from '../SummonerPage/SummonerPage';

// Consider Deleting
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
// import AboutPage from '../AboutPage/AboutPage';
// import UserPage from '../UserPage/UserPage';
// import InfoPage from '../InfoPage/InfoPage';
// import { link } from 'fs';

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

            <Route path='/home' component={HomePage} />

            {/* If data is loaded on when directing to '/search' go to summonerPage 
                else return home */}

            <Route path='/search' render={()=> (
              this.props.summoner.isLoaded ? ( <SummonerPage/>) : ( <Redirect to="/home"/> )
            )
          }/>

            {/* Visiting /search will result in an error page, otherwise it will render the profile page of the user */}
            <ProtectedRoute path='/profile' component={() => { }} />

          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

const mapStoreToProps = store => ({
  summoner: store.summoner
})

export default connect(mapStoreToProps)(App);
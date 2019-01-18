// *----------* React *----------*
import React, { Component } from 'react';

// *----------* Router *----------*
import { withRouter } from 'react-router-dom';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Page components *----------*
import LoginButton from '../LoginButton/LoginButton';
import LoginDropDown from '../LoginDropDown/LoginDropDown';
import ProfileComponent from '../ProfileComponent/ProfileComponent';

// *----------* Components *----------*
import ReviewDropDown from './ReviewDropDown/ReviewDropDown';

// *----------* Styling *----------*
import './Nav.css';
import { CSSTransition } from 'react-transition-group';

//  {/* Show this link if they are logged in or not,
//         but call this link 'Home' if they are logged in,
//         and call this link 'Login / Register' if they are not */}
//         {/* Show the link to the info page and the logout button if the user is logged in */}
//         {/* Always show this link since the about page is not protected */}


// Can be refractored into login button!
class Nav extends Component {
  state = {
    showReviewForm: false,
    appearLogin: false,
    appearRegister: false
  }

  toggleLoginDropDown = () => {
    // console.log(`DROPDOWN!`);
    this.setState({
      appearLogin: !this.state.appearLogin,
    })

    // If either forms open, close if login pressed
    if (this.state.appearRegister || this.state.appearLogin) {
      this.setState({
        appearRegister: false,
        appearLogin: false,
      })
    } else if (!this.state.appearRegister || !this.state.appearLogin) {
      this.setState({
        appearLogin: true,
      })
    }
  }

  toggleRegisterDropDown = () => {
    this.setState({
      appearRegister: !this.state.appearRegister,
      appearLogin: !this.state.appearLogin,
    })
  }

  handleReviewPlayerClick = () => {
    // Send request to saga -> post review -> fetch reviews
    this.setState({
      showReviewForm: !this.state.showReviewForm
    })
  }

  canLeaveReview = () => {
    // Check if this user has reviewed the current summoner being displayed
    const didReview = (this.props.user.reviews.map(review => review.reviewed_summonerName)
      .indexOf(this.props.summoner.summonerName) > -1);

    // console.log(`DID REVIEW = ${didReview}`);
    // console.log(this.props.summoner.summonerName, this.props.user.user.summoner_Name);
    // console.log(this.props.user.user.id,!didReview,this.props.summoner.summonerName != this.props.user.user.summoner_Name,this.props.summonerDataDidLoad);


    if (this.props.user.user.id && !didReview && (this.props.summoner.summonerName != this.props.user.user.summoner_Name) && this.props.summonerDataDidLoad) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div>
        <div className="nav">
          {/* If user is loged in show profile Component */}
          <div
            className="logo"
            onClick={() => {
              this.props.history.push('/');
            }}
            style={{ cursor: 'pointer' }}
          />

          {this.props.user.user.id ?
            // {this.props.summonerDataDidLoad ? () : ()}
            /* If true */
            (
              <div style={{display: 'flex'}}>
                {
                  this.canLeaveReview() &&
                  <div className='review-player' onClick={this.handleReviewPlayerClick}>
                      review player
                  </div>
                }
                <ProfileComponent />
              </div>
            ) :

            /* If false */
            (<div>
              <LoginButton toggleLoginDropDown={this.toggleLoginDropDown} />
              <CSSTransition
                in={this.state.appearLogin}
                appear={true}
                timeout={500}
                classNames="fade"
                mountOnEnter
                unmountOnExit
              >
                {(state) => (<LoginDropDown toggleLoginDropDown={this.toggleLoginDropDown} toggleRegisterDropDown={this.toggleRegisterDropDown} />)}
              </CSSTransition>
              <CSSTransition
                in={this.state.appearRegister}
                appear={true}
                timeout={500}
                classNames="fade"
                mountOnEnter
                unmountOnExit
              >
                {(state) => (<LoginDropDown register={this.state.appearRegister} toggleLoginDropDown={this.toggleLoginDropDown} toggleRegisterDropDown={this.toggleRegisterDropDown} />)}
              </CSSTransition>
            </div>
            )}
        </div>
        <ReviewDropDown 
          summonerName={this.props.summoner.summonerName} 
          userId={this.props.user.user.id} 
          toggleForm={this.handleReviewPlayerClick}
          showReviewForm={this.state.showReviewForm}
          />
      </div>
      );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  summoner: state.summoner.summoner,
  summonerDataDidLoad: state.summoner.isLoaded
});

export default withRouter(connect(mapStateToProps)(Nav));
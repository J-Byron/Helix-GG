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

// import LogOutButton from '../LogOutButton/LogOutButton';

// *----------* Styling *----------*
import './Nav.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

//  {/* Show this link if they are logged in or not,
//         but call this link 'Home' if they are logged in,
//         and call this link 'Login / Register' if they are not */}
//         {/* Show the link to the info page and the logout button if the user is logged in */}
//         {/* Always show this link since the about page is not protected */}


// Can be refractored into login button!
class Nav extends Component {
  state = {
    appearLogin: false,
    appearRegister: false
  }

  toggleLoginDropDown = () => {
    console.log(`DROPDOWN!`);
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

  render() {
    return (
      <div>
        <div className="nav">
          {/* If user is loged in show profile Component */}
          <div 
            className="logo" 
            onClick={()=>{
              this.props.history.push('/');
            }}
            style={{cursor:'pointer'}}
          />

          {this.props.user.id ?

            /* If true */
            (<ProfileComponent />) :

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
              // onExiting={()=>console.log(` Login Exiting!`)}
              // onEntering={()=>console.log(` Login Entering!`)}
              // onExiting={() => console.log("Leaving")}
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
              // onExiting={()=>console.log(`register Exiting!`)}
              // onEntering={()=>console.log(` Register Entering!`)}
              >
                {(state) => (<LoginDropDown register={this.state.appearRegister} toggleLoginDropDown={this.toggleLoginDropDown} toggleRegisterDropDown={this.toggleRegisterDropDown} />)}
              </CSSTransition>
            </div>
            )}
        </div>
      </div>);
  }
}

{/* <Link style={{textDecoration: 'none'}}className="nav-link" to="/home">
        {props.user.id ? 'Home' : (<LoginButton/>)}
        {}
      </Link> */}

{/* {props.user.id && (
        <>
          <Link className="nav-link" to="/info">
            Info Page
          </Link>
          <LogOutButton className="nav-link"/>
        </>
      )}
      
      <Link className="nav-link" to="/about">
        About
      </Link> */}
// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(Nav));
// *----------* React app *----------*
import React, { Component } from 'react'

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Router *----------*
import { withRouter } from 'react-router-dom';

// *----------* Styling *----------*
import './ProfileComponent.css'
import { CSSTransition } from 'react-transition-group';

/*
    Profile Icon
    When Clicked Drop down menu
        * Profile Page (Shows saved summoner Page + favorites + reviews)
        * Settings
        * Theme
*/

class ProfileComponent extends Component {
    state = {
        showMenu: false,
    }

    componentDidMount(){
        // animate welcome user

    }

    handleIconClick = () => {
        this.setState({ showMenu: !this.state.showMenu })
    }

    handleProfileClick = () => {
        this.props.history.push('/profile');
    }

    handleThemeClick = () => {
        console.log('Theme change!');
    }

    handleSettingsClick = () => {

    }

    handleLogoutClick = () => {
        this.props.dispatch({type:'LOGOUT'});
    }

    render() {
        return (
            <div>
                <div className="profile-icon" onClick={this.handleIconClick} />
                <CSSTransition
                    in={this.state.showMenu}
                    appear={true}
                    timeout={500}
                    classNames="fade"
                    mountOnEnter
                    unmountOnExit
                >
                    <div className='menu'>
                        <div className='option profile' onClick={this.handleProfileClick}>
                            Profile
                        </div>
                        <div className='option theme'>
                            Theme
                        </div>
                        <div className='option settings'>
                            Settings
                        </div>
                        <div onClick={this.handleLogoutClick} className='option logout'>
                            Logout
                        </div>
                    </div>
                </CSSTransition>
            </div>
        )
    }
}

const mapStoreToProps = reduxStore => ({
    user: reduxStore.user.user
})

export default withRouter(connect(mapStoreToProps)(ProfileComponent));
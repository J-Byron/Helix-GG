// *----------*  *----------*
import React, { Component } from 'react'

// *----------*  *----------*
import { connect } from 'react-redux';

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
                    </div>
                </CSSTransition>
            </div>
        )
    }
}

const mapStoreToProps = reduxStore => ({
    user: reduxStore.user
})

export default connect(mapStoreToProps)(ProfileComponent);
// *----------* Create React App *----------*
import React, { Component } from 'react';

// *----------* Router *----------*
import { withRouter } from 'react-router-dom';

// *----------*  *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './LoginButton.css';

class LoginButton extends Component {

    render() {
        return (
            <div>
                <div className='login-button' onClick={this.props.toggleDropDown}>
                    Login
                </div>
            </div>
        );
    }
}

export default LoginButton;

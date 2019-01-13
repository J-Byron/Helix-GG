// *----------* Create React App *----------*
import React, { Component } from 'react';

// *----------* Styling *----------*
import './LoginButton.css';

class LoginButton extends Component {

    render() {
        return (
            <div>
                <div className='login-button' onClick={this.props.toggleLoginDropDown}>
                    Login
                </div>
            </div>
        );
    }
}

export default LoginButton;

// *----------* Create react *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './LoginDropDown.css'

// Responsible for Verifying user info
class LoginDropDown extends Component {

    componentWillMount() {
        // Animate drop down
        console.log('Mounting!');
    }

    componentWillUnmount() {
        // Animate un-drop-down?

        console.log('Unmounting!');
    }

    render() {
        return (
            <div className="dropDownMenu">
                <div className="upper">
                    {/* <p className="login-text" style={{ textAlign: 'center' }}>Login</p> */}
                    <input style={{ marginBottom: "15px", marginTop:"40px" }} className="input-text" type="text" placeholder="Username" />
                    <input style={{ marginBottom: "0px" }} className="input-text" type="password" placeholder="Password" />
                </div>
                <div className="signin-button">Login</div>
                <p className="register-text" style={{ textAlign: 'center' }}>
                    Not registered? <em className="create-account">Create an account</em>
                </p>
            </div>
        );
    }
}

export default connect()(LoginDropDown);
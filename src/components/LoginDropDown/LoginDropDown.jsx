// *----------* Create react *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './LoginDropDown.css'

// Responsible for Verifying user info
class LoginDropDown extends Component {

    state = {
        loginUsername: '',
        loginPassword: '',
        registerUsername: '',
        registerPassword: '',
        comfirmRegisterPassword: '',
        emailInput: ''
    }

    componentWillMount() {
        // Animate drop down
        // console.log(this.props.appearRegister);

        // console.log('Mounting!');
    }

    componentWillUnmount() {
        // Animate un-drop-down?

        // console.log('Unmounting!');
    }

    handleLoginClick = () => {
        // DispatchToReducer
        if (this.state.loginUsername && this.state.loginPassword) {
            console.log(`Logging in`);
            
            this.props.dispatch({
                type: 'LOGIN', payload: {
                    username: this.state.loginUsername,
                    password: this.state.loginPassword,
                }
            })

            if(this.props.user.id){
                this.props.toggleLoginDropDown();
            }

        } else {
            // Render an error
            console.log('Both fields must be filled');
            this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
        }
    }

    handleRegisterClick = () => {
        // Check if all fields
        if (this.state.registerUsername && this.state.comfirmRegisterPassword) {
            if (this.state.registerPassword === this.state.comfirmRegisterPassword) {
                
                console.log('registering');
                console.log(this.state);
                
                this.props.dispatch({
                    type: 'REGISTER',
                    payload: {
                        username: this.state.registerUsername,
                        password: this.state.registerPassword,
                        email: this.state.emailInput
                    }
                })
                this.props.toggleLoginDropDown();
                // this.props.toggleRegisterDropDown();
            } else {
                console.log('Passwords Do not match');

            }
        } else {
            console.log('All fields must be filled!');
        }
    }

    // set state by event...name to event...target
    handleFieldChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })

        // console.log(`${event.target.name} = ${event.target.value}`);
        
    }


    render() {
        return (
            <div>
                {
                    this.props.register ?

                        (
                            <div className="dropDownMenu-register">
                                <div className="upper">
                                    <p className="login-text" style={{ textAlign: 'center' }}>Register</p>
                                    <p className="error-text" style={{ textAlign: 'center' }}>{this.props.errors.registrationMessage}</p>
                                    <input
                                        className="input-text"
                                        name='registerUsername'
                                        value={this.state.registerUsername}
                                        onChange={this.handleFieldChange}
                                        style={{ margin: "0px auto 15px auto", marginTop: "20px" }}
                                        className="input-text"
                                        placeholder="Desired username" 
                                        />
                                    <input
                                        className="input-text"
                                        name='registerPassword'
                                        value={this.state.registerPassword}
                                        onChange={this.handleFieldChange}
                                        style={{ margin: "0px auto 15px auto" }}
                                        type="password"
                                        placeholder="Password" />
                                    <input
                                        className="input-text"
                                        name='comfirmRegisterPassword'
                                        value={this.state.comfirmRegisterPassword}
                                        onChange={this.handleFieldChange}
                                        style={{ margin: "0px auto 15px auto" }}
                                        type="password"
                                        placeholder="Retype password" />
                                    {/* <input style={{ margin: "0px auto 15px auto" }} className="input-text" placeholder="Email" /> */}
                                </div>
                                <div className="signin-button" onClick={this.handleRegisterClick}>Register</div>
                            </div>
                        ) : (
                            <div className="dropDownMenu">
                                <div className="upper">
                                    <p className="error-text" style={{ textAlign: 'center' }}>{this.props.errors.loginMessage}</p>
                                    <input
                                        className="input-text"
                                        name='loginUsername'
                                        value={this.state.loginUsername}
                                        onChange={this.handleFieldChange}
                                        style={{ marginBottom: "15px", marginTop: "40px" }}
                                        type="text"
                                        placeholder="Username" />
                                    <input
                                        className="input-text"
                                        name='loginPassword'
                                        value={this.state.loginPassword}
                                        onChange={this.handleFieldChange}
                                        style={{ marginBottom: "0px" }}
                                        type="password"
                                        placeholder="Password" />
                                </div>
                                <div className="signin-button" onClick={this.handleLoginClick}>Login</div>
                                <p className="register-text" style={{ textAlign: 'center' }} onClick={this.props.toggleRegisterDropDown}>
                                    Not registered? <em className="create-account">Create an account</em>
                                </p>
                            </div>
                        )
                }
            </div>
        );
    }
}

const mapStoreToProps = reduxStore => ({
    errors: reduxStore.errors,
    user: reduxStore.user
})

export default connect(mapStoreToProps)(LoginDropDown);
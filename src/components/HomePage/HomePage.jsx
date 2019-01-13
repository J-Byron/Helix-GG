// *----------* Create React *----------*
import React, { Component } from 'react';
import './HomePage.css';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Router *----------*
import { withRouter } from "react-router";

// const themes = {
//     light:{
//         primary:,
//         secodary:,
//         background:,
//         text:
//     },
//     dark:{
//         primary:,
//         secodary:,
//         background:,
//         text:
//     }
// }

class HomePage extends Component {
    state = {
        usernameInput: '',
        selectedRegion: 'NA',
        isSearching: false,

    }

    componentDidMount() {
        console.log('HomePage mounted');
    }

    componentWillMount(){
        console.log('will mount');
        
    }

    handleChange = (event) => {
        this.setState(
            {
                usernameInput: event.target.value
            }
        )
    }

    handleSubmissionClick = () => {

        // Validate query

        // regular expression use to validate summoner names 
        //          *** NOT OPTIMIZED FOR JS YET ***
        // const regex = RegExp('^[-\w\.\$@\*\!]{1,16}$');
        // const nameIsValidated = regex.test(this.state.usernameInput);

        // Clear whatever state in redux
        // this.props.dispatch({ type: 'RESET_DATA' })

        // create query object
        const queryParameters = { summonerName: this.state.usernameInput, region: this.state.selectedRegion }

        // Dispatch query to redux --> API Requests need to be made on server side because of CORS & process.env only accessible in node
        console.log('Preparing to dispatch', queryParameters);
        // console.log(this.props.history);
        
        this.props.dispatch({ type: 'FETCH_SUMMONER', payload: queryParameters, history: this.props.history })

        // Set state to searching
        this.setState({
            isSearching: true
        })



        // this.props.history.push(`/search/summonerName=${this.state.usernameInput}`);

        // Clear input field
        // this.setState(
        //     {
        //         usernameInput: ''
        //     }
        // )

    }

    handleLoading = () => {

        const isSearching = this.state.isSearching;

        if(isSearching){
            return(
                <div className="bouncing-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
            );
        }
    }

    render() {
            return (
                <div>
                    <div style={{ justifyContent: 'center' }}>
    
                        <p className="DisplayText"> Helix<em>.GG</em></p>
                        <div className="searchBar">
                            <input className='searchForm' onChange={this.handleChange} value={this.state.usernameInput} type="text" placeholder="Search summoner" spellCheck="false">
                            </input>
                            <div className="searchButton" onClick={this.handleSubmissionClick}>.GG</div>
                        </div>
    
    
                    </div>
                    {this.handleLoading()}
                </div>
            );
    }
}

export default withRouter(connect()(HomePage));
// *----------* Create React *----------*
import React, { Component } from 'react';
import './HomePage.css';

// *----------* Redux *----------*
import { connect } from 'react-redux';

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
        selectedRegion: 'NA'
    }

    componentDidlMount() {
        console.log('HomePage mounted');
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

        // create query object
        const queryParameters = { summonerName: this.state.usernameInput, region: this.state.selectedRegion }

        // Dispatch query to redux --> API Requests need to be made on server side because of CORS & process.env only accessible in node
        console.log('Preparing to dispatch', queryParameters);
        this.props.dispatch({ type: 'FETCH_SUMMONER', payload: queryParameters })

        // Clear input field
        this.setState(
            {
                usernameInput: ''
            }
        )
    }

    render() {
        return (
            <div style={{ justifyContent: 'center' }}>

                <p className="DisplayText"> Helix.GG </p>
                <div className="searchBar">
                    <input className='searchForm' onChange={this.handleChange} value={this.state.usernameInput} type="text" placeholder="Search summoner" spellCheck="false">
                    </input>
                    <div className="searchButton" onClick={this.handleSubmissionClick}>.GG</div>
                </div>


            </div>
        );
    }
}

export default connect()(HomePage);
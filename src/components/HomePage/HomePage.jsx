// *----------* Create React *----------*
import React, { Component } from 'react';
import './HomePage.css';
// *----------* Redux *----------*
import { connect } from 'react-redux';
import axios from 'axios';

// *----------*  *----------*
require('dotenv').config()

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

        // regular expression use to validate summoner names
        // const regex = RegExp('^[-\w\.\$@\*\!]{1,16}$');
        // const nameIsValidated = regex.test(this.state.usernameInput);
        const queryParameters = { summonerName: this.state.usernameInput, region: this.state.selectedRegion }

        // this.props.dispatch({type:'QUERY_SUMMONER',payload:query})
        console.log('Preparing to dispatch', queryParameters);
        console.log(process.env);

        // Request needs to be made on server side because of CORS, process.env only accessible in node
        const queryString = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${queryParameters.summonerName}?api_key=RGAPI-08642ef3-71ec-4f3d-a037-9dec1b831e65`;
        axios.get(queryString).then(response =>{
            console.log(response);
        }).catch(err =>{
            console.log(err);
        })

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
// *----------* Create React *----------*
import React, { Component } from 'react';
import './HomePage.css';
// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Material UI *----------*

class HomePage extends Component {
    state = {
        usernameInput: '',
        selectedRegion:'NA'
    }

    componentDidlMount() {
        console.log('HomePage mounted');

    }

    handleChange = (event) =>{
        this.setState(
            {
                usernameInput: event.target.value
            }
        )
    }

    handleSubmissionClick = () =>{

        console.log(this.state.usernameInput);
        const query = {summonerName: this.state.usernameInput, region: this.state.selectedRegion}

        // this.props.dispatch({type:'QUERY_SUMMONER',payload:query})
        console.log('Preparing to ship', query);
        
    }

    render() {
        console.log(this.state.usernameInput);
        
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
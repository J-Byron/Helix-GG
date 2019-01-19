// *----------* React App *----------*
import React, {Component} from 'react';

// *----------* Redux *----------*
import {connect} from 'react-redux';

// *----------* Page Components *----------*
import SummonerSummary from './SummonerSummary/SummonerSummary';
import SummonerGameSummary from './SummonerGameSummary/SummonerGameSummary';
import SummonerHistory from './SummonerHistory/SummonerHistory';

// *----------* Styling *----------*
import './SummonerPage.css';

/* 

    Responsible for :
        * displaying Summoner summary (component with reviews)
        * display tab for normal/ranked components
            * Summary of past 20 games
                * Pie graph & top 3 champs  
            * table for each Cell
                * cell with summoner icon, kda, items etc...  

*/

class SummonerPage extends Component{
    state = {
        // Data for each queue

    }

    componentWillUnmount(){
        // Reset data on summoner page unmount so review isnt visible
        this.props.dispatch({type: 'RESET_DATA'})
    }

    render(){
        return(
            <div className={'container'}>

                {/* Seach Bar */}

                {/* Summary Component*/}
                <SummonerSummary/>

                {/* Analytics */}
                < SummonerGameSummary />
                {/*  */}

                {/* Match History Component*/}
                {/* <SummonerHistory/> */}
            </div>
        )
    }
}

export default connect()(SummonerPage);
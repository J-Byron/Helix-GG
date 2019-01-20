// *----------* CRA *----------*
import React from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Components *----------*
import SummonerHistoryList from './SummonerHistoryList/SummonerHistoryList'

// *----------* styling *----------*
import './SummonerHistory.css'

const SummonerHistory = (props) =>{
    return(
        <div className='match-history-container'>
            <SummonerHistoryList matches={props.matchHistory}/>
        </div>
    )
}

const mapStoreToProps = store => ({
    matchHistory: store.summoner.summonerHistory.matchHistory
})

export default connect(mapStoreToProps)(SummonerHistory);
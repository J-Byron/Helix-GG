// *----------* CRA *----------*
import React from 'react';

// *----------* Components *----------*
import SummonerHistoryItem from './SummonerHistoryItem/SummonerHistoryItem'

// *----------* Styling *----------*
import './SummonerHistoryList.css'

const SummonerHistoryList = (props) => {
    return(
        <div>
            {
                props.matches.map((match,index) => {
                    return (<SummonerHistoryItem key={index} match={match}/>)
                })
            }
        </div>
    )
}

export default SummonerHistoryList;

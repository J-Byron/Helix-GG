// *----------* CRA *----------*
import React from 'react';

// *----------* Styling *----------*
import './TopChampionItem.css'

const TopChampionItem = (props) => {
    return (
        <div className='champion-cell' >
            {/* Icon */}
            <div className='champion-cell-image' style={{ backgroundImage: `url(${props.champion.icon})` }} />

            {/* Name */}
            <div className='champion-cell-name'>
                {props.champion.champion}
            </div>

            <div className='wr-box' style={{width:'25%'}}>
                <span className='wr-header'>
                    {props.champion.winrate}
                </span>

                <div>
                    <span>
                        {`${props.champion.totalGamesPlayed}G `}
                    </span>
                    <span className='wr-blue'>
                        {`${props.champion.wins}W `}
                    </span>
                    <span className='wr-red'>
                        {`${props.champion.loses}L`}
                    </span>
                </div>
            </div>

            {/*  */}
            <div className='kda-box' style={{width:'25%'}}>

                <span className='wr-header'>
                    {props.champion.kdar}
                </span>

                <div>
                    <span className='wr-blue'>
                        {`${props.champion.averageKills}K `}
                    </span>
                    <span className='wr-red'>
                        {`${props.champion.averageDeaths}D `}
                    </span>
                    <span >
                        {`${props.champion.averageAssists}A`}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TopChampionItem;

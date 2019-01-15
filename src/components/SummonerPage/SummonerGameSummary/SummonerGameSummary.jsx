// *----------* React App *----------*
import React, { Component } from 'react';

// *----------* Styling *----------*
import './SummonerGameSummary.css';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Components *----------*
import { ResponsivePie } from '@nivo/pie';

class SummonerGameSummary extends Component {

    hasData = () => {
        if (this.props.summonerHistory.hasOwnProperty('matchResults')) {
            return true;
        }
        return false;
    }
    render() {

        const { wins, losses } = (this.hasData()) ? this.props.summonerHistory.matchResults : { wins: 3, losses: 1 };

        return (
            <div className='game-summary-container'>
                <div className='wr-kda-container'>
                    <div className='piegraph'>
                        <ResponsivePie
                            data={
                                [
                                    {
                                        "id": "Losses",
                                        "label": "Losses",
                                        "value": losses,
                                    },
                                    {
                                        "id": "Wins",
                                        "label": "Wins",
                                        "value": wins,
                                    }
                                ]
                            }
                            margin={{
                                "top": 0,
                                "right": 0,
                                "bottom": 0,
                                "left": 0,
                            }}
                            innerRadius={0.6}
                            cornerRadius={2}
                            colors={['#FE4365', '#0CA5B0']}
                            colorBy="id"
                            enableRadialLabels={false}
                            radialLabelsSkipAngle={10}
                            radialLabelsTextXOffset={6}
                            radialLabelsTextColor="#333333"
                            radialLabelsLinkOffset={-24}
                            radialLabelsLinkDiagonalLength={16}
                            radialLabelsLinkHorizontalLength={24}
                            radialLabelsLinkStrokeWidth={1}
                            radialLabelsLinkColor="inherit"
                            enableSlicesLabels={false}
                            slicesLabelsSkipAngle={0}
                            slicesLabelsTextColor="#eeeeee"
                            isInteractive={false}
                            animate={true}
                            motionStiffness={90}
                            motionDamping={15}

                        />
                    </div>

                    {/* Win rate */}
                    <div className='wr-box'>
                        <span className='wr-text'>
                            {this.props.summonerHistoryResults.winrate}
                        </span>

                        <div>
                            <span>
                                {`${this.props.summonerHistoryResults.wins + this.props.summonerHistoryResults.losses}G `}  
                            </span>
                            <span className='wr-wins'>
                                {`${this.props.summonerHistoryResults.wins}W `}
                            </span>
                            <span className='wr-losses'>
                                {`${this.props.summonerHistoryResults.losses}L`}
                            </span>
                        </div>
                    </div>

                    {/* KDA */}
                    <div className='kda-box'>
                    
                        <span className='kdar'>
                            {this.props.summonerHistoryResults.winrate}
                        </span>

                        <div>
                            <span>
                                {`${this.props.summonerHistoryResults.wins + this.props.summonerHistoryResults.losses}G `}  
                            </span>
                            <span className='wr-wins'>
                                {`${this.props.summonerHistoryResults.wins}W `}
                            </span>
                            <span className='wr-losses'>
                                {`${this.props.summonerHistoryResults.losses}L`}
                            </span>
                        </div>
                    </div>

                </div>
                <div className='top-champion-container'>
                    <div className='top-champion-row'>
                        {/* icon */}
                        <div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStoreToProps = store => ({
    summonerHistory: store.summoner.summonerHistory,
    summonerHistoryResults: store.summoner.summonerHistory.matchResults
})

export default connect(mapStoreToProps)(SummonerGameSummary);

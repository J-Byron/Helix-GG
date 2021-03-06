// *----------* React App *----------*
import React, { Component } from 'react';

// *----------* Styling *----------*
import './SummonerGameSummary.css';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Components *----------*
import { ResponsivePie } from '@nivo/pie';

// *----------* Page Components *----------*
import TopChampionList from './TopChampionList/TopChampionList';

class SummonerGameSummary extends Component {

    hasData = () => {
        if (this.props.summonerHistory.hasOwnProperty('matchResults')) {
            return true;
        }
        return false;
    }
    render() {

        const { wins, losses, winrate } = (this.hasData()) ? this.props.summonerHistory.matchResults : { wins: 3, losses: 1, winrate: '75.0%' };
        const { kills, deaths, assists, kdar } = (this.hasData()) ? this.props.summonerHistory.KDA : { kills: 4, deaths: 5, assists: 1, kdar: '1.00:1' };


        return (
            <div className='game-summary-container'>
                <div className='wr-kda-container'>
                    <div className='wr-container'>
                        <div className='wr-piegraph'>
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
                                isInteractive={true}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}

                            />
                        </div>

                        {/* Win rate */}
                        <div className='wr-box'>
                            <span className='wr-header'>
                                {winrate}
                            </span>

                            <div>
                                <span>
                                    {`${wins + losses}G `}
                                </span>
                                <span className='wr-blue'>
                                    {`${wins}W `}
                                </span>
                                <span className='wr-red'>
                                    {`${losses}L`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='kda-box-container'>
                        <div className='wr-piegraph'>
                            <ResponsivePie
                                data={
                                    [
                                        {
                                            "id": "Assists",
                                            "label": "Assists",
                                            "value": assists,
                                        },
                                        {
                                            "id": "Deaths",
                                            "label": "Deaths",
                                            "value": deaths,
                                        },
                                        {
                                            "id": "Kills",
                                            "label": "Kills",
                                            "value": kills,
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
                                colors={['#eeeeee', '#FE4365', '#0CA5B0']}
                                colorBy="id"
                                enableRadialLabels={false}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextXOffset={6}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkOffset={-24}
                                radialLabelsLinkDiagonalLength={10}
                                radialLabelsLinkHorizontalLength={10}
                                radialLabelsLinkStrokeWidth={1}
                                radialLabelsLinkColor="inherit"
                                enableSlicesLabels={false}
                                slicesLabelsSkipAngle={0}
                                slicesLabelsTextColor="#eeeeee"
                                isInteractive={true}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}

                            />
                        </div>
                        {/* KDA */}
                        <div className='kda-box'>

                            <span className='wr-header'>
                                {kdar}
                            </span>

                            <div>
                                <span className='wr-blue'>
                                    {`${kills}K `}
                                </span>
                                <span className='wr-red'>
                                    {`${deaths}D `}
                                </span>
                                <span >
                                    {`${assists}A`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='top-champion-container'>
                    <TopChampionList champions={this.props.summonerHistory.top3ChampData}/>
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

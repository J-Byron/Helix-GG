// *----------* CRA *----------*
import React from 'react';

// *----------* styling *----------*
import './SummonerHistoryItem.css';

/*
 
champion: {
    name: "Nunu", 
    icon: "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/champion/Nunu.png"
}
 
cs: 119
items: (7) [
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/1413.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/3110.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/3047.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/3742.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/1028.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/0.png", 
    "http://ddragon.leagueoflegends.com/cdn/9.1.1/img/item/3340.png"]
kda: {kills: 8, deaths: 3, assists: 16, kdar: "8.00:1"}
matchParticipants: (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
result: true
runes: {
    mainIcon: "http://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png", 
    subIcon: "http://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png"
}
spells: {
    spell1Icon: "http://ddragon.leagueoflegends.com/cdn/8.24.1/img/spell/SummonerFlash.png", 
    spell2Icon: "http://ddragon.leagueoflegends.com/cdn/8.24.1/img/spell/SummonerSmite.png"
}
time: "28m 39s"
 
*/

const SummonerHistoryItem = props => {

    const { champion, cs, items, kda, matchParticipants, result, runes, spells, time } = props.match;
    console.log(props);

    return (
        <div className='match-cell'>
            {/* Result bar */}
            <div className={`result-bar ${(result) ? "result-bar-victory" : "result-bar-defeat"}`} />

            {/* Time & result */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`result-status ${(result) ? "result-text-victory" : "result-text-defeat"}`}>
                    {
                        (result) ? "Victory" : "Defeat"
                    }
                </div>

                <div className='match-time'>
                    {time}
                </div>
            </div>

            {/* Champion & Spells */}
            <div className='champion-container' style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Champion & spells, 2 columns*/}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className='match-champion-icon' style={{ backgroundImage: `url(${champion.icon})` }} />
                    {/* spells 2 columns 2 rows */}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>

                        {/* Col 1 (spells) */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {/*  */}
                            <div className='spell-icon' style={{ backgroundImage: `url(${spells.spell1Icon})` }} />
                            {/*  */}
                            <div className='spell-icon' style={{ backgroundImage: `url(${spells.spell2Icon})` }} />
                        </div >

                        {/* col 2 (runes) */}
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                            {/*  */}
                            <div className='spell-icon' style={{ backgroundImage: `url(${runes.mainIcon})` }} />
                            {/*  */}
                            <div className='spell-icon' style={{ backgroundImage: `url(${runes.subIcon})` }} />
                        </div>
                    </div>
                </div>

                {/* Champion name */}
                <div className='match-champion-text'>
                    {champion.name}
                </div>
            </div>

            {/* KDA */}
            {/* JSS Practice */}
            <div
                className='match-kda-container'
                style={{
                    display: 'flex',
                    margin: 'auto 5% auto 5%',
                    flexDirection: 'column',
                    fontFamily: 'Krungthep',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#eee',
                    verticalAlign: 'middle',
                }}>

                {/*  kdar */}
                <div>
                    {`${kda.kdar} KDA`}
                </div>

                {/*  k/d/a */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: '12px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    letterSpacing: '2px'
                }}>
                    <div style={{ color: '#00adb5' }}>
                        {`${kda.kills} `}
                    </div>
                    {" / "}
                    <div style={{ color: '#ff2e63' }}>
                        {` ${kda.deaths} `}
                    </div>
                    {" / "}
                    <div>
                        {` ${kda.assists}`}
                    </div>
                </div>

                <div style={{
                    fontSize: '10px',
                    color: '#eeeeee91'
                }}>
                    {`${cs} cs`}
                </div>

            </div>

            {/* Items */}

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '125px',
                height: '60px',
                margin: '15px 25px 15px auto',
                justifyContent: 'center',
                verticalAlign: 'middle'
            }}>

                {/* Items */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* 0-2 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[0]})`,
                        }} />

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[1]})`,
                        }} />

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[2]})`,
                        }} />

                    </div>

                    {/* 3-5 */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '3.33px 0px;'
                    }}>

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[3]})`,
                        }} />

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[4]})`,
                        }} />

                        <div className='match-item-icon' style={{
                            backgroundImage: `url(${items[5]})`,
                        }} />


                    </div>
                </div>

                {/* Ward */}
                <div className='match-item-icon' style={{
                    backgroundImage: `url(${items[6]})`,
                    margin: 'auto 2px'
                }} />

            </div>
        </div>
    )
}

export default SummonerHistoryItem;
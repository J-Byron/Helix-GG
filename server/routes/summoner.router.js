// *----------* Modules *----------*
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

/* 

        -Notes-
            * Converting IDs to Names @ http://ddragonexplorer.com/cdn/8.24.1/data/en_US/
            * Images @ https://ddragonexplorer.com/cdn/
            * replace http://ddragonexplorer.com/ with https://ddragon.leagueoflegends.com/

        -Queue Types-

        400: Draft 
        420: Ranked
        450: ARAM
        440: Flex
        850: Intermediate Bots
        840: Beginner Bots   
        
        -Rate Limits-

        'x-app-rate-limit': '20:1,100:120',
        'x-method-rate-limit': '1000:10',

        -Request rates-

        Summoner name - 1
        Summoner Rank - 1
        Match History = (1 + 20) + (1 + 20) = 42

    */

// *----------* Routes *----------*

router.get('/:region/:summonerName', (req,res)=>{


    // Prepare data from request params
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const queueType = (req.params.queue == 'Ranked') ? 420 : 400;

    // Environment variables
    const API_KEY = process.env.API_KEY;
    const D_VERSION = process.env.DDRAGON_VERSION;

    // Holds identifiers for further requests about summoner
    let summonerIDs = {
        summonerId: '',     // league rank endpoint
        accountId: '',      // match list endpoint
        puuid: '',          // migration to v4
        profileIconId: '',  // for fetching icon in ddragon
    };

    // Data to be sent to be used by client
    let summonerData = {
        level: '',  //  1-999
        rank: '',   // unranked-challenger
        icon: '',   // .png <-- CHECK .version
        winrate: '', // Winrate for past 20 games
        KDA: {kills:0, deaths: 0, assists: 0, kda:0},  
        top3ChampData: [],  // KDA & WR for top 3 champs along with icon 
        championData: [],                       // Top 10 ranked champs [{champion icon, win rate, averages cs, kda }]
        matchHistory: [],   // [{matchid, build, champion icon, cs, date, result, kda, [teammates]}]
    }

    // Array to hold all champions and their associated ids (used for finding image for champions)
    let champions = [];

    //
    axios.get(`http://ddragon.leagueoflegends.com/cdn/8.24.1/data/en_US/champion.json`).then(response => {
        
        const championData = response.data.data;

        champions = Object.keys(championData).map(champion => {
            return {id: championData[champion].key , name: championData[champion].id}
        })

    }).catch(err => {
        console.log(err);
    });

    // Spells 

    // Runes

    console.log(`${region} ${summonerName} ${API_KEY}`);

    // Query riotgames for summoner by summoner name 
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`).then(response =>{

        // update summonerIDs for use as params for riot endpoints
        summonerIDs.summonerId = response.data.id;
        summonerIDs.accountId = response.data.accountId;
        summonerIDs.puuid = response.data.puuid;
        summonerIDs.profileIconId = response.data.profileIconId;

        // Update summonerData with info from response
        summonerData.level = response.data.summonerLevel
        summonerData.icon = `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/profileicon/${response.data.profileIconId}.png`

        // Query league rank by summonerID
        axios.get(`https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerIDs.summonerId}?api_key=${API_KEY}`)
        .then(response => {

            // Find ranked Details
            response.data.forEach(element => {
                if(element.queueType === 'RANKED_SOLO_5x5'){

                    // Update summonerData
                    summonerData.rank = `${element.tier} ${element.rank}`
                    // console.log(element.tier,element.rank ,element.leaguePoints)
                }
            });
        }).catch(error=>{
            console.log(error.response);
            res.sendStatus(400);
        })

        // Query ranked solo queue match history
        axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=400&endIndex=5&beginIndex=0&api_key=${API_KEY}`)
        // axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=${queueType}&endIndex=5&beginIndex=0&api_key=${API_KEY}`)
        .then(response =>{

            // Query data for each individual match of matchlist with gameID
            for (let match of response.data.matches){
                axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${API_KEY}`)
                .then(response =>{

                    const matchData = response.data;
                    let matchParticipantId;

                    // Information about each match requested by clientside
                    let matchInformation = {};

                    
                    for(let participant of matchData.participantIdentities){

                        // find summoner participant id 
                        if(summonerName.toUpperCase() ===  participant.player.summonerName.toUpperCase()){
                            // Need image for: 1 champion, 2 spells, 2 runes, 7 items, 10 players = 22 api requests
                            
                            // Get the matchParticipant id of the queried summoner in particular match
                            matchParticipantId = participant.participantId;

                            break;
                        }

                    }

                     // Champion *http://ddragonexplorer.com/cdn/8.24.1/data/en_US/championFull.json*
                     matchInformation.champion = matchData.participants[matchParticipantId - 1].championId

                     // Spells *http://ddragonexplorer.com/cdn/8.24.1/data/en_US/summoner.json*
                     matchInformation.spells = {spell1: matchData.participants[matchParticipantId - 1].spell1Id, spell2: matchData.participants[matchParticipantId - 1].spell2Id};
                     
                     // End game items 
                     matchInformation.items = [
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item0}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item1}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item2}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item3}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item4}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item5}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchData.participants[matchParticipantId - 1].stats.item6}.png`,
                     ]

                     // Runes *http://ddragonexplorer.com/cdn/img/perk-images/*
                     matchInformation.runes = {main: matchData.participants[matchParticipantId - 1].stats.perkPrimaryStyle, sub: matchData.participants[matchParticipantId - 1].stats.perkSubStyle}
                     
                     // CS
                     matchInformation.cs = matchData.participants[matchParticipantId - 1].stats.totalMinionsKilled + 
                                           matchData.participants[matchParticipantId - 1].stats.neutralMinionsKilled;

                     // Date (<1hr, hr, day, week)

                     // Time (minutes:seconds)
                     matchInformation.time = `${Math.floor(matchData.gameDuration / 60)}m ${matchData.gameDuration % 60}s`;

                     // Result
                     matchInformation.result = matchData.participants[matchParticipantId - 1].stats.win

                     // KDA
                     matchInformation.kda = {
                         kills: matchData.participants[matchParticipantId - 1].stats.kills,
                         deaths: matchData.participants[matchParticipantId - 1].stats.deaths,
                         assists: matchData.participants[matchParticipantId - 1].stats.assists,
                         kdar: `${
                             ((matchData.participants[matchParticipantId - 1].stats.kills + 
                             matchData.participants[matchParticipantId - 1].stats.assists) /
                             matchData.participants[matchParticipantId - 1].stats.deaths).toFixed(2)
                         }:1`
                     }

                     // Players: Determine participants of match (excluding queried Summoner)
                    matchInformation.matchParticipants = matchData.participantIdentities.filter(participant => {
                        return participant.participantId != matchParticipantId
                    }).map(participant => {
                        // An object with information about each player that isn't the queried summoner
                        return {
                            participantSummonerName: participant.player.summonerName, 

                            // *http://ddragonexplorer.com/cdn/8.24.1/data/en_US/championFull.json*
                            championId: matchData.participants[participant.participantId - 1].championId, 
                            teamId: matchData.participants[participant.participantId - 1].teamId
                            }
                    })

                    // console.log(matchInformation);
                    // console.log(matchData);
                    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)

                    //summonerData.matchHistory.ranked.push({ result, champion icon, [spells], cs, date, kda, build, [teammates]})

                }).catch(error => {
                    console.log(error);
                })
            }

        }).catch(error=>{
            console.log(error.response);
        })

            // Show rate limits to prevent blacklist
            console.log(
                `Rate limits: 
                    App-- limit: [${response.headers["x-app-rate-limit"]}] count: [${response.headers["x-app-rate-limit-count"]}]
                    Method-- limit: [${response.headers["x-method-rate-limit"]}] count: [${response.headers["x-method-rate-limit-count"]}]
                    `
                );

    }).catch(error=>{
        // res.send({didSucceed: false, data: null})\
        console.log(error.response);
        res.sendStatus(400);
    })
})

// *----------* Helper functions *----------*

module.exports = router;
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
        level: '',  //  1-999 DONE
        rank: '',   // unranked-challenger DONE
        icon: '',   // .png <-- CHECK .version DONE
        matchResults: {wins:0, losses: 0, winrate:''}, // Winrate for past 20 games
        KDA: {kills:0, deaths: 0, assists: 0, kdar:''}, // DONE
        top3ChampData: [],  // KDA & WR for top 3 champs along with icon 
        championData: [],   // Top 10 ranked champs [{champion icon, win rate, averages cs, kda }]
        matchHistory: [],   // [{matchid, build, champion icon, cs, date, result, kda, [teammates]}] DONE
    }

    // objects to hold all champions/spells/tunes and their associated ids ( used for finding images )
    let champions = {};
    let spells = {};
    let keystoneRunes = {};

    // Query ddragon for all champions and map each with an id and name into champions
    axios.get(`http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/data/en_US/champion.json`).then(response => {
        
        const championData = response.data.data;

        for(let champion in championData){
            champions[`${championData[champion].key}`] =  championData[champion].id;
        }

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
        axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=400&endIndex=1&beginIndex=0&api_key=${API_KEY}`)
        // axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=${queueType}&endIndex=5&beginIndex=0&api_key=${API_KEY}`)
        .then(response =>{

            // Query data for each individual match of matchlist with gameID
            for (let match of response.data.matches){
                axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${API_KEY}`)
                .then(response =>{

                    // Contains all relevant data about the match
                    const matchaResponseData = response.data;

                    // Queried summoner's identity in match
                    let matchParticipant;

                    // Information about each match, pushed into match history
                    let matchInformation = {};

                    // find summoner participant id 
                    for(let participant of matchaResponseData.participantIdentities){

                        if(summonerName.toUpperCase() ===  participant.player.summonerName.toUpperCase()){
                            // Need image for: 1 champion, 2 spells, 2 runes, 7 items, 10 players = 22 api requests
                            
                            // Get the matchParticipant id of the queried summoner in particular match
                            matchParticipant = matchaResponseData.participants[participant.participantId - 1];
                            break;
                        }
                    }

                     // Champion *ddragonexplorer.com/cdn/8.24.1/img/champion/{}.png*
                     const summonerChampionId = matchParticipant.championId;
                     matchInformation.champion = {name: champions[summonerChampionId], icon: `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/champion/${champions[summonerChampionId]}.png`};

                     // Spells *http://ddragonexplorer.com/cdn/8.24.1/data/en_US/summoner.json*
                     matchInformation.spells = {spell1: matchParticipant.spell1Id, spell2: matchParticipant.spell2Id};
                     
                     // End game items 
                     matchInformation.items = [
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item0}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item1}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item2}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item3}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item4}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item5}.png`,
                        `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${matchParticipant.stats.item6}.png`,
                     ]

                     // Runes *http://ddragonexplorer.com/cdn/img/perk-images/*
                     matchInformation.runes = {main: matchParticipant.stats.perkPrimaryStyle, sub: matchParticipant.stats.perkSubStyle}
                     
                     // CS
                     matchInformation.cs = matchParticipant.stats.totalMinionsKilled + matchParticipant.stats.neutralMinionsKilled;

                     // Date (<1hr, hr, day, week)

                     // Time (minutes:seconds)
                     matchInformation.time = `${Math.floor(matchaResponseData.gameDuration / 60)}m ${matchaResponseData.gameDuration % 60}s`;

                     // Result
                     matchInformation.result = matchParticipant.stats.win

                     // Update total results of matches
                     summonerData.matchResults[(matchParticipant.stats.win)? 'wins' : 'losses'] += 1;

                     // KDA
                     matchInformation.kda = {
                         kills: matchParticipant.stats.kills,
                         deaths: matchParticipant.stats.deaths,
                         assists: matchParticipant.stats.assists,
                         kdar: `${
                             ((matchParticipant.stats.kills + matchParticipant.stats.assists) /matchParticipant.stats.deaths).toFixed(2)
                         }:1`
                     }

                     // Champion KDA

                     // Update total KDA of matches
                     summonerData.KDA.kills += matchParticipant.stats.kills;
                     summonerData.KDA.assists += matchParticipant.stats.assists;
                     summonerData.KDA.deaths += matchParticipant.stats.deaths;

                     // Players: Determine participants of match (excluding queried Summoner)
                    matchInformation.matchParticipants = matchaResponseData.participantIdentities.filter(participant => {
                        return participant.participantId != matchParticipant.participantId
                    }).map(participant => {
                        // An object with information about each player that isn't the queried summoner
                        const player = matchaResponseData.participants[participant.participantId - 1];
                        return {
                            participantSummonerName: participant.player.summonerName, 
                            championIcon: `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/champion/${champions[player.championId]}.png`, 
                            teamId: player.teamId
                            }
                    })

                    // console.log(matchInformation);
                    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)

                    summonerData.matchHistory.push(matchInformation)

                }).catch(error => {
                    console.log(error);
                })

            }// End of matchlist for loop

            // Calculate Winrate after all match results calculated
            summonerData.matchResults.winrate = `${
                (summonerData.matchResults.wins/
                (summonerData.matchResults.wins + summonerData.matchResults.losses)).toFixed(2)
            }%`

            // Calculate kill/death ration after all matches' KDAs calculated
            summonerData.KDA.kdar = `${((summonerData.KDA.kills + summonerData.KDA.assists)/ summonerData.KDA.deaths).toFixed(2)}:1`

            //
            console.log(summonerData);
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
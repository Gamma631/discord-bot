import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'osu-web.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { EmbedBuilder } = require('discord.js');
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// var fs = require('fs');
// var jsonData = JSON.stringify(rs);
// fs.writeFile("test.txt", jsonData, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });

export async function getUser(username){
    let oAuthToken = await getAuth();
    // Client for the current API (API v2)
    const client = new Client(oAuthToken);
    
    let user = await client.users.getUser(username, {
        urlParams: {
          mode: 'osu'
        }
    });
    console.log(`Username: ${user.username}\npp: ${user.statistics['pp']}`);
}

export async function getRecent(username, amount) {
    let oAuthToken = await getAuth();
    // Client for the current API (API v2)
    const client = new Client(oAuthToken);
    var id;
    if (Number.isInteger(username)){
        id = username;
    }
    else {
        id = await getID(username, client);
    }

    let rs = await client.users.getUserScores(id, 'recent', {
        query: {
          mode: 'osu',
          limit: amount,
          include_fails: 1
    }});
    
    rs.forEach(result => console.log(result.beatmapset.title + ': ' + result.beatmap.version + '\nAcc: ' + result.accuracy));
}

export async function getBeatmap(beatmapID, message){
    if (/^https/.test(beatmapID)){
        let test = beatmapID.split('/');
        if (test.length == 5){
            beatmapID = test[4];
        }
        else if (test.length == 6){
            beatmapID = test[5];
        }
    }
    else if (!/^\d+/.test(beatmapID)) {
        return console.log("Invalid beatmap ID or link provided!");
    }
    let oAuthToken = await getAuth();
    // Client for the current API (API v2)
    const client = new Client(oAuthToken);

    let bm = await client.beatmaps.getBeatmap(beatmapID, {
        urlParams: {
          mode: 'osu'
        }
    });
    console.log(bm);
    await fetchMess(message);
}

async function getID(username, client){
    let user = await client.users.getUser(username, {
        urlParams: {
          mode: 'osu'
        }
    });
    return user.id;
}

async function getAuth(){
    const oauth = new URL(
        "https://osu.ppy.sh/oauth/token"
    );
    
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    
    let body = `client_id=${process.env.OSU_ID}&client_secret=${process.env.OSU_SECRET}&grant_type=client_credentials&scope=public`;
    
    var getoauth = await fetch(oauth, {
        method: "POST",
        headers,
        body: body,
    }).then(response => response.json());

    return getoauth.access_token;
}

async function fetchMess(message){
    return console.log(await message.channel.fetchMessages({limit: 10})); 
}
'use strict';
const express = require('express');
const app = express();

const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const axios = require('axios');

const port = process.env.port || 3002;

const players = require('./results.json');

app.listen(port);

var urls = [];
var failed = [];

const downloadData = () => {
    for(let i = 21; i < 22; i++){


        const options = {
            uri: `https://www.mlssoccer.com/players?page=`+i,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        rp(options)
            .then(($)=>{
                $('.player_list li').each((i, li)=>{

                    const $item = $(li);
                    const $playerUrl = $item.children('a').attr('href');
                    let uri = `https://www.mlssoccer.com` + $playerUrl;

                    const options2 = {
                        uri: uri,
                        transform: (body) => {
                            return cheerio.load(body);
                        }
                    };
                        rp(options2)
                            .then(($) =>{
                                var $player_info = $('.player_container').html();
                                var $image = $('.headshot_image').attr('src');
                                var $name = $('.title_overlay .title').text().split(" ");
                                var $club = $('.club a').text();
                                var $position = $('.position').text();
                                var $number = $('.jersey_container .subtitle').text();
                                var $realName = $('.player_meta .name').text().split('Real Name:\n')[1];
                                var $height = $('.player_meta .stat').eq(0).text();
                                var $weight = $('.player_meta .stat').eq(1).text();
                                var $designation = $('.player_meta .designation').text();
                                var $birthplace = () =>{
                                    var $location = $('.hometown').text().split('Birthplace:\n')[1];
                                    if($location == null){
                                        return $('.hometown').text().split('Hometown:\n')[1];
                                    }
                                    else if($location.indexOf("Hometown:") !== -1){
                                        return $location.split("Hometown:")[0];
                                    }else{
                                        return $location;
                                    }
                                };
                                var $age = $('.age').text().split('Age:\n')[1].split(" (")[1].split(')')[0].split('/');
                                var $twitter = $('.twitter_handle a').attr('href');
                                var checkSocial = () =>{
                                    if($twitter){
                                        return $twitter;
                                    }else{
                                        return ''
                                    }
                                };

                                var data = {
                                    firstName: $name[0],
                                    lastName: $name[1],
                                    image: $image,
                                    currentTeam: $club,
                                    position: $position,
                                    number: $number,
                                    realName: $realName,
                                    height: $height,
                                    weight: $weight,
                                    designation: $designation,
                                    birthplace: $birthplace(),
                                    dob: $age[2]+"-"+$age[0]+"-"+$age[1],
                                    social: checkSocial()
                                };

                                axios.post('https://afternoon-ridge-70888.herokuapp.com/api/players', data)
                                    .then((res)=>{console.log("Post Successful!")})
                                    .catch((err)=>{console.log(err)});
                            })
                            .catch((err, $player_info) => {
                                failed.push({
                                    uri: uri,
                                    status: "failed",
                                    data: $player_info
                                });
                                console.log(uri,": FAILED ", err);
                            });

                });
                console.log("Page ",i," completed.");
            })
            .catch((err)=>{
                console.log(err)
            });

    }


    phase2();

};

var phase2 = () => {
    while(failed.length > 0){
        console.log("Starting Phase 2");
        for(var j = 0; j > failed.length; j++){
            if(failed[j].status === "failed"){
                const options3 = {
                    uri: failed[j].uri,
                    transform: (body) => {
                        return cheerio.load(body);
                    }
                };

                rp(options3)
                    .then(($) =>{
                        var $player_info = $('.player_container').html();
                        urls.push({
                            uri: uri,
                            status: "success",
                            data: $player_info
                        });
                        failed.splice(j, 1);
                        console.log(uri,": SUCCESS");
                    })
                    .catch((err) => {
                        console.log(uri,": FAILED");
                    });
            }
        }
    }
};

downloadData();

console.log("Running hot on Port "+port+"!");
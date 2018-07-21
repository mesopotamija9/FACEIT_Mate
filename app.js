var express = require("express");
var app = express();
var request = require('request');
var bodyParser = require("body-parser");
var upperCase = require('upper-case')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// faction1 Info
var faction1;
var players1 = [];
var avatar1 = [];
var country1 = [];
var skill_level1 = [];
var elo1 = [];
var membership_type1 = [];

// faction2 Info
var faction2;
var players2 = [];
var avatar2 = [];
var country2 = [];
var skill_level2 = [];
var elo2 = [];
var membership_type2 = [];

var data1 = [];
var data2 = [];

app.get("/", function(req, res) {
    res.render("index.ejs");  
});

app.post("/gameID", function(req, res) {
    var gameID = req.body.game_id;

    faction1 = "";
    faction2 = "";

    data1 = [];
    data2 = [];

    players1 = [];
    avatar1 = [];
    country1 = [];
    skill_level1 = [];
    elo1 = [];
    membership_type1 = [];

    players2 = [];
    avatar2 = [];
    country2 = [];
    skill_level2 = [];
    elo2 = [];
    membership_type2 = [];

    // GET data from FACEIT API
    var headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer 2aba054d-3580-466e-b26d-7ca7551931d1'
    };

    var options = {
        url: 'https://open.faceit.com/data/v4/matches/' + gameID,
        headers: headers
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var playerList = JSON.parse(body);

            faction1 = playerList["teams"]["faction1"]["name"];
            faction2 = playerList["teams"]["faction2"]["name"];
            for (var i = 0; i < 5; i++) {
                var faction1Nickname = playerList["teams"]["faction1"]["roster_v1"][i]["nickname"];
                var faction2Nickname = playerList["teams"]["faction2"]["roster_v1"][i]["nickname"];

                var options2 = {
                    url: "https://open.faceit.com/data/v4/players?nickname=" + faction1Nickname, 
                    headers: headers
                }; 

                request(options2, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var playerDetails = JSON.parse(body);

                        players1.push(playerDetails["nickname"]);
                        avatar1.push(playerDetails["avatar"]);
                        country1.push(playerDetails["country"]);
                        skill_level1.push(playerDetails["games"]["csgo"]["skill_level"]);
                        elo1.push(playerDetails["games"]["csgo"]["faceit_elo"]);
                        membership_type1.push(playerDetails["membership_type"]);
                    }
                });

                var options3 = {
                    url: "https://open.faceit.com/data/v4/players?nickname=" + faction2Nickname, 
                    headers: headers
                };

                request(options3, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var playerDetails = JSON.parse(body);

                        players2.push(playerDetails["nickname"]);
                        avatar2.push(playerDetails["avatar"]);
                        country2.push(playerDetails["country"]);
                        skill_level2.push(playerDetails["games"]["csgo"]["skill_level"]);
                        elo2.push(playerDetails["games"]["csgo"]["faceit_elo"]);
                        membership_type2.push(playerDetails["membership_type"]);

                        setTimeout(function() {
                        for (var i = 0; i < 5; i ++) {
                            data1[i] = {'player': players1[i], 'avatar': avatar1[i], 'country': upperCase(country1[i]), 'skill_level': skill_level1[i], 'elo' : elo1[i] };
                            data2[i] = {'player': players2[i], 'avatar': avatar2[i], 'country': upperCase(country2[i]), 'skill_level': skill_level2[i], 'elo' : elo2[i] };
                            if (data1[i].avatar === '') {
                                data1[i].avatar = "https://cdn-frontend.faceit.com/web/912/src/app/assets/images-compress/avatars/avatar_default_user_300x300.jpg";
                            }
                            if (data2[i].avatar === '') {
                                data2[i].avatar = "https://cdn-frontend.faceit.com/web/912/src/app/assets/images-compress/avatars/avatar_default_user_300x300.jpg";
                            }
                        } 
                    }, 700);
                    }
                });
            }
            
            setTimeout(function() {
                res.redirect("/match");
            }, 5000);
        }
        else {
            res.redirect("/error");
        }
    });
});

app.get("/match", function(req, res) {
    res.render("match.ejs", {
        faction1: faction1,
        faction2: faction2,
        data1 : data1,
        data2 : data2
    });
});

app.get("/error", function(req, res) {
    res.render("error.ejs");
});

app.listen(3000, function() {
    console.log("Listening on port 3000...");
});





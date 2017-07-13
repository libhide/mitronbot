'use strict';
require('dotenv').config();

const express = require('express');
const twit = require('twit');

const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

const T = new twit(TWIT_CONFIG);

// Heroku requires a web server, so uh, here you go
const app = express();

app.get('/', function (req, res) {
  res.send('Bleep bloop, bot is running.');
});

app.listen(process.env.PORT || 3000);

// genString generated the "Mitron" string
const genString = () => {
  let arrrs = "";
  let ens = "";

  // Maximum of 10 occurances
  let rOcc = Math.ceil(Math.random() * 10);
  let nOcc = Math.ceil(Math.random() * 10);

  for (let i = 0; i < rOcc; i++) { arrrs += "r"; }
  for (let i = 0; i < nOcc; i++) { ens += "n"; }

  let s = `Mit${arrrs}o${ens}`;

  // 20% chance of SCREAMING
  return Math.random() > 0.2 ? s : s.toUpperCase();
}

// An array of the topics/keywords we want to track
const topics = [
  'Modi'
];

// Reputable news sources
const users = [
  "ndtv",
  "htTweets",
  "IndiaToday",
  "ZeeNews",
  "TimesNow",
  "timesofindia",
  "dna",
  "bloomberg",
  "mashable",
  "mashableindia"
];

const stream = T.stream('statuses/filter', {
  track: topics
});

stream.on('tweet', tweet => {
  const user = tweet.user.screen_name;

  // We only want the reputable sources to cause a MITRON
  if (users.indexOf(user) === -1) return;

  const status = `https://twitter.com/${user}/status/${tweet.id_str}`;
  const commentary = genString();

  console.log(commentary, '\n', status);

  T.post('statuses/update', {status: [commentary, status].join('\n')})
    .then(function(result) {
      console.log(`Tweeted "${[commentary, status].join('\n')}"`);
    })
    .catch(err => console.error(err));
});

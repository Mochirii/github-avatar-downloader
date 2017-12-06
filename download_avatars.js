var request = require('request');
var fs = require('fs');
const repoOwner = process.argv[2];
const repoName = process.argv[3];




console.log('Welcome to the GitHub Avatar Downloader!');
// console.log('Make sure you type in the name of the Contributor and then the Repo name.')
var requestURL = {
  url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
  headers: {
    'User-Agent': 'request',
  } 
};

function getRepoContributors(requestURL, cb) {
  var url = {}
  request(requestURL, function(err, res, body) {
    var array = JSON.parse(body);
    if(!fs.existsSync("./avatars/")) {
      fs.mkdirSync("./avatars/")
    }
    array.forEach(function(entry){
      url.username = entry.login;
      url.avatar = entry.avatar_url;
      cb(url)
    })
  })
}

function downloadImageByUrl(url) {
  request.get(url.avatar)
  .on('error', function (err){
    throw err;
  })
  .on('end', function (end){
    console.log("Downloaded")
  })  
  .pipe(fs.createWriteStream('./avatars/' + url.username + '.jpg'))
}

getRepoContributors(requestURL, downloadImageByUrl) 
require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');

const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// console.log(process.env.CLIENT_ID, process.env.CLIENT_ID,)
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:
    app.get('/',(req, res) => {
        res.render('index')
    })
    app.get('/artist-search', (req, res, next) => {
        
        const artistSearch = req.query.artist
        
        spotifyApi
        .searchArtists(artistSearch)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            const myArtistArray = data.body.artists.items;
            res.render('artist-search-results.hbs', {'artistArray': myArtistArray})
        })
              
        .catch(err => console.log('The error while searching artists occurred: ', err));
    });

    app.get("/artist/:artistId/albums", (req, res, next) => {
        const artistId = req.params.artistId;

        spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log(data.body.items);
            res.render('album.hbs', { 'albumsArray': data.body.items})
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    });

    app.get('/album/:albumId/tracks', (req, res, next) =>{
        const albumId = req.params.albumId
        spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log(data.body.items);
            res.render('tracks.hbs', { 'tracksArray': data.body.items})
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

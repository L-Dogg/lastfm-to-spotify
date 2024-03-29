(function(exports) {
	var g_tracks = '';
    var prefix = 'spotify:track:';
    var tracks = new Array();

    client_id = '3e1b5000798543d9acea810a30616b17';
    redirect_uri = 'http://lastfm2spotify.herokuapp.com/callback.html';

	var findOnSpotify = function(query) {
        $.ajax({
        	type: 'GET',
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query.artist + " " + query.song,
                type: 'track',
				limit: '1'
            },
            success: function (response) {

        	    if (response.tracks == null || response.tracks.items == null || response.tracks.items.length < 1) {
                    console.log("Couldn't find track: " + query);
                    return;
                }
                g_tracks = g_tracks + (prefix + response.tracks.items[0].id) + ",";
            },
			error: function (response) {
                console.log("Couldn't find track: " + query);
                console.log(response);
            }
        });
	}

	var getTracksFromLastfm = function (userName, limit) {
		$.ajax({
			url: "https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=" + userName +
				"&api_key=5275ac1e04b48394d83abd58eccc0cce&format=json&limit=" + limit,
            error: function (response) {
                console.log(response);
            },
            success: function (response) {
                processTracks(response.lovedtracks.track)
            }
		})
    }

	var clearList = function () {
        g_tracks = '';
        var ul = document.getElementById("trackList");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }

    var processTracks = function (trackList) {
		clearList();

        tracks = new Array();
        var ul = document.getElementById("trackList");
        var i = 0;
        var k = 0;
		trackList.forEach(function (track) {
			var current = {
                artist: track.artist.name,
                song: track.name
            };

			setTimeout(function () {
                findOnSpotify(current);
            }, k * 300);

            tracks.push(current);

            var li = document.createElement("li");
            li.className = "list-group-item";
            var image = document.createElement("img");
            image.src = track.image[0]["#text"];
            li.appendChild(image);
            li.appendChild(document.createTextNode("\t" + (i + 1) + ". " + current.artist + " - " + current.song));
            ul.appendChild(li);

            i++;
            if (i % 70 === 0) {
                k++;
            }
        })
    }

	var login = function() {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', g_tracks.slice(0, -1));
		localStorage.setItem('createplaylist-name', document.getElementById('playlistNameInput').value);
		var w = window.open(url, 'window', 'WIDTH=400,HEIGHT=500');
	}

	exports.startApp = function() {
		$('#start').click(function() {
            login();
		})
		$('#loadLoved').click(function (event) {
            event.preventDefault();
            getTracksFromLastfm(document.getElementById('usernameInput').value, 1000);
        });
}

})(window);

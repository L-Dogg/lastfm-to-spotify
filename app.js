(function(exports) {

	var g_name = '';
	var g_tracks = '';

    var id = '';

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
				id = response.tracks.items[0].id;
				console.log(id);
            },
			error: function (response) {
                console.log(response);
            }
        });
	}

	var getTracksFromLastfm = function (userName) {
		$.ajax({
			url: "http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=" + userName +
				"&api_key=5275ac1e04b48394d83abd58eccc0cce&format=json&limit=10",
            error: function (response) {
                console.log(response);
            },
            success: function (response) {
                processTracks(response.lovedtracks.track)
            }
		})
    }

    var tracks = new Array();

	var clearList = function () {
        var ul = document.getElementById("trackList");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }

    var processTracks = function (trackList) {
		clearList();

        tracks = new Array();
        var ul = document.getElementById("trackList");

		trackList.forEach(function (track) {
			var current = {
                artist: track.artist.name,
                song: track.name
            };
            findOnSpotify(current);
			current.spotifyId = id;
            tracks.push(current);

            var li = document.createElement("li");
            li.className = "list-group-item";
            li.appendChild(document.createTextNode(current.artist + " - " + current.song + " / " + current.spotifyId));
            ul.appendChild(li);

        })
    }

	client_id = '3e1b5000798543d9acea810a30616b17';
	redirect_uri = 'http://localhost:8000/callback.html';

	var login = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'window', 'WIDTH=400,HEIGHT=500');
	}

	exports.startApp = function() {
		$('#start').click(function() {
            login(function() {});
		})
		$('#loadLoved').click(function (event) {
            event.preventDefault();
            getTracksFromLastfm("orggg");
        });
}

})(window);

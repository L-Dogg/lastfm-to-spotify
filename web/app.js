(function(exports) {

	var g_name = '';
	var g_tracks = '';

	var Playlist = function() {	}

	var doSearch = function(word, callback) {
		console.log('search for ' + word);
		var url = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"'+word+'"');
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got track', r);
				callback({
					word: word,
					tracks: r.tracks.items
						.map(function(item) {
							var ret = {
								name: item.name,
								artist: 'Unknown',
								artist_uri: '',
								album: item.album.name,
								album_uri: item.album.uri,
								cover_url: '',
								uri: item.uri
							}
							if (item.artists.length > 0) {
								ret.artist = item.artists[0].name;
								ret.artist_uri = item.artists[0].uri;
							}
							if (item.album.images.length > 0) {
								ret.cover_url = item.album.images[item.album.images.length - 1].url;
							}
							return ret;
						})
				});
			},
			error: function(r) {
				callback({
					word: word,
					tracks: []
				});
			}
		});
	}

	var g_access_token = '';
	var g_username = '';

	client_id = 'd37a9e88667b4fb3bc994299de2a52bd';
	redirect_uri = 'http://localhost:8000/callback.html';

	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	}

	exports.startApp = function() {
		console.log('start app.');
		$('#alltext').keyup(function() {
			queueRefreshText();
		});
		$('#alltext').change(function() {
			queueRefreshText();
		});
		$('#start').click(function() {
			doLogin(function() {});
		})
		$('#alltext').text('hello world');
		refreshText();
		resolveOneWord();
}

})(window);

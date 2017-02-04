(function(exports) {

	var g_name = '';
	var g_tracks = '';

	var doSearch = function(word) {
		console.log('search for ' + word);
		var myUrl = 'https://api.spotify.com/v1/search?type=track&limit=1&q=' + encodeURIComponent('track:"'+word+'"');
		var ajax = $.ajax({url: myUrl})
		ajax.complete(function (response) {
			console.log(response);
			debugger;
        })

	}

	var g_access_token = '';
	var g_username = '';

	client_id = '3e1b5000798543d9acea810a30616b17';
	redirect_uri = 'http://localhost:8000/callback.html';

	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'window', 'WIDTH=400,HEIGHT=500');
	}

	exports.startApp = function() {
		console.log('start app.')
		$('#start').click(function() {
			doLogin(function() {});
		})
		$('#loadLoved').click(function () {
            doSearch("palaces of montezuma");
        });
}

})(window);

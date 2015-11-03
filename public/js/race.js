/**
 * 大屏幕互动页面
 * 李伟
 * 2015-08-15
 */

$(function(){
	var statusElem = document.querySelector('.status'),
		usersElem = document.querySelector('.users'),
		chart = document.querySelector('.chart'),
		delta = getDelta(100);
	var socket = io.connect('', {
		reconnection: true,
		reconnectionAttempts: 5
	});
	socket.on('connect', function(data){
        console.log('dd');
    });
	socket.on('start', function(data){
		var users = data.users;
		Object.keys(users).forEach(function(item){
			update(data.userNumber, users[item]);
			updateBar(users[item].count, users[item].uid);
		});
	});
	socket.on('join', function(data){
		update(data.userNumber, data.user);
	});
	socket.on('shake', function(data){
		var uid = data.uid;
		$('.' + uid).find('.count').text(data.count);
		updateBar(data.count, uid);
	});

	function update(number, user){
		statusElem.innerText = '当前用户数：' + number;
		usersElem.innerHTML += '<p class="'+user.uid+'">'+user.uid+' joined. <span class="count">count: '+user.count+'</span></p>';
		createBar(user.count, user.uid);
	}


	function getDelta(extrema){
		var chartHeight = $('.chart').height();
		return chartHeight / extrema;
	}
	function createBar(count, uid){
		var html = [
			'<div class="bar-wrap">',
				'<div class="bar">',
					'<span class="bar-text" id="barText'+uid+'">' + count + '</span>',
					'<div class="bar-main" id="bar' + uid + '"></div>',
				'</div>',
			'</div>'
		];
		chart.innerHTML += html.join('');
	}
	function updateBar(count, uid){
		$('#bar'+uid).css('height', delta * count);
		$('#barText'+uid).text(count);
	}
});
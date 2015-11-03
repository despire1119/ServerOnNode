/**
 * io
 */
var rooms = {};
function exist(obj, key){
	return obj.hasOwnProperty(key) && (key in obj);
}
// 计算排名

//根据wx_openid获取用户索引
function getUserIndex(arr, user){
	var ret = -1;
	arr.forEach(function(item, index){
		if(item.wx_openid === user.wx_openid){
			ret = index;
		}
	});
	return ret;
}
function getTop(users, num){
	users.sort(function(a, b){
		return b.shaking_num - a.shaking_num;
	});
	return users.slice(0, num);
}
function getFormatDate(){
	return new Date().toISOString().replace('T',' ').replace(/\..+/, '');
}
exports.connect = function(io){
	io.on('connection', function(socket){

		var addedUser = false;
		var disconnected = false;

		// 进入活动页，创建一个活动
		socket.on('create', function(data){
			var roomId = data.roomId;
			var room = {};
			if(!exist(rooms, roomId)){
				rooms[roomId] = {
					roomId: roomId,
					isEnd: false,
					joinNumber: 0,
					playNumber: 0,
					store_sess_id: data.sessId,
					store_act_id: data.actId,
					actInfo: data.actInfo,
					users: []
				};
				console.log('a new room created: ' + roomId, ', current room count: ' + Object.keys(rooms).length);
			}
			room = rooms[roomId];
			socket.emit('init', {
				roomId: roomId,
				joinNumber: room.joinNumber
			});
		});

		// 报名人数
		socket.on('prejoin', function(data){
			var roomId = data.roomId;
			var room;
			room = rooms[roomId];
			if(room&&(!room.isEnd)){
				room.joinNumber += 1;
				console.log(roomId + '报名人数：' + room.joinNumber);
				socket.broadcast.emit('prejoin', {
					roomId: roomId,
					joinNumber: room.joinNumber
				});
			}else{
				console.log('room unexist');
			}
		});

		

		//倒计时开始
		socket.on('countdown', function(data){
			socket.broadcast.emit('countdown', {
				roomId: data.roomId
			});
			console.log('begin countdown');
		});

		// 游戏开始
		socket.on('start', function(data){
			console.log('start game');
			var startTime = getFormatDate();
			var users;
			if(rooms[data.roomId]){
				users = rooms[data.roomId].users;
				// 设置开始时间
				users.forEach(function(item, index, arr){
					item.start_time = startTime;
				});
				socket.broadcast.emit('start', {
					roomId: data.roomId
				});
			}else{
				console.log('room ' + roomId + ' unexist');
			}
			
		});

		// 游戏加入
		socket.on('join', function(data){
			addedUser = true;
			var room = rooms[data.roomId];
			var users;
			if(room&&(!room.isEnd)){
				users = rooms[data.roomId].users;
				if(getUserIndex(users, data)<0){
					data.shaking_time = 0;
					data.end_time = 0;
					users.push(data);
					socket.user = data;
					console.log('an user join in room: ' + data.roomId);
				}
			}else{
				console.log('room unexist');
			}
			
		});

		// 摇动事件
		socket.on('shake', function(data){
			var room = rooms[data.roomId];
			var targetNum = room.actInfo.target_num;
			if(!room.isEnd){
				var users = room.users;
				var user = users[getUserIndex(users, data)];
				user.shaking_num = data.shaking_num;
				if(user.shaking_num === targetNum){
					user.end_time = getFormatDate();
					user.shaking_time = new Date(user.end_time) - new Date(user.start_time);
					console.log(user.shaking_time);
				}
				socket.broadcast.emit('update', {
					roomId: data.roomId,
					targetNum: room.actInfo.target_num,
					users: getTop(users, room.actInfo.screen_user_num)
				});
			}
			
		});

		// 当前游戏结束
		socket.on('end', function(data){
			var room = rooms[data.roomId];
			room.isEnd = true;
			console.log('act ' + data.roomId + ' end');
			// 设置结束时间和排名
			var users = room.users;
			users.forEach(function(item, index, arr){
				item.start_time = room.start_time;
				if(item.end_time === 0){
					item.end_time = getFormatDate();
					item.shaking_time = new Date(item.end_time) - new Date(item.start_time);
				}
				item.ranking_num = index + 1;
			});

			
		});

		// 结果
		socket.on('result', function(data){
			var roomId = data.roomId;
			var room = rooms[roomId];
			var users = room.users;
			var topUsers = getTop(users, room.actInfo.screen_user_num)
			var ret = [];
			topUsers.forEach(function(item, index, arr){
				ret.push({
					shaking_time: item.shaking_time,
					shakeing_num: item.shaking_num,
					ranking_num: item.ranking_num,
					openid: item.openid,
					wx_pic: item.wx_pic,
					nickname: item.nickname
				});
			});
			console.log(ret.length);
			socket.emit('result', {
				roomId: roomId,
				store_act_id: room.store_act_id,
				screen_user_num: room.actInfo.screen_user_num,
				users: ret
 			});
 			socket.broadcast.emit('end', {
				room: room
			});
		});

		// socket.on('error', function(error){
		// 	console.log(error);
		// });

		// disconnect
		socket.on('disconnect', function () {
			disconnected = true;
			// if('wx_openid' in data){
			// 	var users = rooms[data.roomId];
			// 	var index = getUserIndex(users, socket.user);
			// 	setTimeout(function(){
			// 		if(disconnected&&addedUser){
			//  			users.splice(index, 1);
			// 	 	}
			// 	}, 5000);
			// }
		});
	});
}

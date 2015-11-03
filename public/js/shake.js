/**
 * device shake
 * 李伟
 * 2015-08-10
 */

;(function(window){
	var Shake = function(options){
		var settings = {
			THRESHOLD: 6000,
        TIMESPAN: 150,
			onShake: function(){},
			onStop: function(){},
			onEnd: function(){}
		};
		Object.keys(options).forEach(function(item, index){
			settings[item] = options[item];
		});
		
		this.THRESHOLD = settings.THRESHOLD;
    this.TIMESPAN = settings.TIMESPAN;
		this.onShake = settings.onShake;
		this.onStop = settings.onStop;
		this.onEnd = settings.onEnd;
	this.count = 0;
	this.duration = 0;
	this.enabled = true;
	this.isShakeing = false;
	this.acceleration = {
		x: 0,
		y: 0,
		z: 0
	};
	this.accelerationIG = {
		x: 0,
		y: 0,
		z: 0
	};
	this.speed = 0;
	};
	Shake.prototype.start = function(){
		var x = 0;
    var y = 0;
    var z = 0;
    var lastX = 0;
    var lastY = 0;
    var lastZ = 0;
    var lastUpdate = 0;
    var self = this;

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', shakeHandler, false);
    } else {
        alert("设备不支持摇动");
    }

    function shakeHandler(eventData) {
        var acceleration = eventData.acceleration;
        var accelerationIG = eventData.accelerationIncludingGravity;
        var currentTime = new Date().getTime();
        var diff = currentTime - lastUpdate;
        self.acceleration = {
        	x: round(acceleration.x),
        	y: round(acceleration.y),
        	z: round(acceleration.z)
        };
        self.accelerationIG = {
        	x: round(accelerationIG.x),
        	y: round(accelerationIG.y),
        	z: round(accelerationIG.z)
        };
        if (self.enabled && diff > self.TIMESPAN) {
            lastUpdate = currentTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diff * 10000;
            self.speed = speed;
            if (speed > self.THRESHOLD) {
            	self.isShakeing = true;
                self.onShake();
            }else{
            	if(self.isShakeing){
            		self.isShakeing = false;
            		self.onStop();
            	}
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        }
    }

    function round(value){
    	var amt = 10;
    	return Math.round(value * amt) / amt;
    }
	};
	window.Shake = Shake;
})(window);

;(function(window, Shake){
    window.Play = {
        mode: 'timing',
        timeSpan: 30,
        totalCount: 60, 
        isStart: false,
        isEnd: false,
        shake: null,
        uid: '',
        init: function(){

            // 玩法，timing|counting
            // TODO 后台获取 mode
            this.mode = 'timing';

            // 时长，计时时设置
            if(this.mode === 'timing'){
                // 后台获取 time
                this.timeSpan = 30;
            }else{
                // 后台获取 count
                this.totalCount = 60;
            }

            // uid
            this.uid = this.getUid();
        },
        getUid: function(){
            return '123';
        },
        sendPlayData: function(){
            // 发送用户摇动次数
        },
        end: function(){
            this.isEnd = true;
        }
    }
})(window, window.Shake || {});

$(function () {
    var count = 0;
    var result = document.querySelector('#count');
    var uid = Date.now();
    var socket = io.connect('', {
        reconnection: true,
        reconnectionAttempts: 5
    });

    // new client
    socket.on('connect', function(){
        socket.emit('join', {
            uid: uid,
            nickname: 'zeron',
            count: 0
        });
    });
    socket.on('reconnect_error', function(){
        console.log('connect error, try again.');
    });
    socket.on('reconnect_failed', function(){
        console.log('connect failed!');
    });
    $('#trigger').on('click', function(){
        count++;
        socket.emit('shake', count);
    });
    var shake = new Shake({
        onShake: function(){
            this.count += 1;
            result.innerHTML = this.count;
            document.querySelector('#info').innerHTML = '<p>x: ' + this.acceleration.x + '</p><p>y: ' + this.acceleration.y + '</p><p>z: ' + this.acceleration.z + '</p>';
            document.querySelector('#speed').innerHTML = 'Speed: ' + this.speed;

            // $.ajax({
            //  type: 'post',
            //  url: '/api/shake',
            //  data: {
            //      count: this.count
            //  },
            //  success: function(data){
            //      //alert(data.msg);
            //  }
            // });
            socket.emit('update', this.count);

        }
    });
    shake.start();
});

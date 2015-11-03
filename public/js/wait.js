$(function () {
	$.ajax({
		type: 'get',
		async: false,
		url: '/api/state',
		timeout: 1000000,
		success: function(data){
			console.log(data.state);
		}
	});

});
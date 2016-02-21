$(function() {
	new State({
		'start' : new GoTo({
			'type' : 'next',
			'new_state' : 'get_messages',
		}),
		'listen' : new Combine([
			new Binder({
				'action' : 'click',
	    			'target' : function() {
					return $('#send_message');
				},
				'type' : 'next',
				'new_state' : 'send_message',
			}),
			new Enabler({
				'target' : function () {
					return $('#message_text');
				},
			}),
			new Timer({
				'timeout' : 1000000,
				'type' : 'next',
				'new_state' : 'get_messages',
			}),
		]),
		'send_message' : new SendQuery({
			'ajax_data' : function(context) {
				var user_name = $('#send_message_user_name').val();
				if (user_name == '')  {
					user_name = 'Anonymous';
				}
				return {
					'module' : 'Message',
					'type' : 'add',
					'text' : $('#message_text').val(),
					'user_name' : user_name,
					'user_email' : $('#send_message_user_email').val(),
				};
			},
			'type' : 'next',
			'new_state' : 'clean_message',
		}),
		'clean_message' : new Combine([
			new Executer(function(context) {
				$('#message_text').val("");
			}),
			new GoTo({
				'type' : 'next',
				'new_state' : 'get_messages',
			}),
		]),
		'get_messages' : new Combine([
			new Binder({
				'action' : 'click',
	    			'target' : function() {
					return $('#send_message');
				},
				'type' : 'next',
				'new_state' : 'send_message',
			}),
			new Enabler({
				'target' : function () {
					return $('#message_text');
				},
			}),
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'Message',
						'type' : 'get',
						'condition' : 1,
					};
				},
				'write_to' : 'messages',
				'type' : 'next',
				'new_state' : 'draw_messages',
			}),


		]),
		'draw_messages' : new Combine([
			new Executer(function(context) {
				var html = [];
				console.log("Start drawing");
				for (var i = 0; i < context.messages.length; ++i) {
					var date = new Date(context.messages[i].Time*1000);
					//var iso = date.toISOString().match(/(\d{2}:\d{2}:\d{2})/)
					var head = context.messages[i].UserName
						+ ' '
						+ date.toString()
						+ ' №'
						+ context.messages[i].Id;

					html.push(
						'<div'
							+ ' class="panel"'
							+ ' style="'
								+ 'width:700px;border:1px solid #ccc;'
								+ 'border-top-left-radius:0px;'
								+ 'border-top-right-radius:0px"'
						+ '>'
							+ '<div'
								+ ' class="panel-heading"'
								+ ' style="'
									+ 'background-color:#91C6F5;'
									+ 'border-top-left-radius:0px;'
									+ 'border-top-right-radius:0px"'
							+ '>'
								+ head
						+ '</div>'
							+ '<div class="panel-body" style="background-color:#FFFCEC">'
								+ context.messages[i].Message
							+ '</div>'
						+ '</div>'
					);
				}
				$('#messages').html(html.join(""));
				console.log("Stop drawing");
			}),
			new GoTo({
				'type' : 'next',
				'new_state' : 'listen',
			}),
		]),
	});
});


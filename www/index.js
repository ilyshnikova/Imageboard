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
				'timeout' : 1,
				'type' : 'next',
				'new_state' : 'get_messages',
			}),
		]),
		'send_message' : new SendQuery({
			'ajax_data' : function(context) {
				return {
					'module' : 'Message',
					'type' : 'add',
					'text' : $('#message_text').val(),
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
					html.push(
						'<div>'
							+ context.messages[i].Message
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


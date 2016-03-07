function get_menu_bind_config(depth, type) {
	return [
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#all_boards');
			},
			'type' : type,
			'depth' : depth,
			'new_state' : 'draw_menu::show_all_boards',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#all_messages');
			},
			'type' :  type,
			'depth' : depth,
			'new_state' : 'draw_menu::show_all_messages',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#all_comments');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::show_all_comments',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#all_images');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::show_all_images',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#answers');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::show_answers',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#settings');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::show_settings',
		}),
		new Binder({
			'action' : 'click',
			'target' : function() {
				return $('#exit');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::show_exit',
		}),
	];
}


$(function() {
	new State({
		'start' : new SendQuery({
			'ajax_data' : function(context) {
				return  {
					'module' : 'User',
					'type' : 'get',
					'user_hash' : read_cookie('user_hash'),
				};
			},
			'write_to' : 'user',
			'type' : 'next',
			'new_state' : 'check_authorization',
		}),
		'check_authorization' : new GoTo({
			'type' : 'next',
			'new_state' : function (context) {
				if (context.user.Id) {
					return 'draw_menu';
				} else {
					return 'login';
				}
			}
		}),
		'login' : new Combine([
			new BDialog({
				'id' : 'login_form',
				'title' : 'Login.',
				'data' : function(context) {
					var is_password_incorrect  = '';
					if (read_cookie('user_hash')) {
						is_password_incorrect = 'Your password is incorrect.';
					}
					return 	(
						'<div style="color:red;">'
							+ is_password_incorrect
						+ ' </div>'
						+ '<br>'
						+ '<div class="input-group">'
							+'<span class="input-group-addon">'
								+ 'Username'
							+ '</span>'
							+'<input'

								+ ' type="text"'
								+ ' class="form-control"'
								+ ' placeholder="username"'
								+ ' aria-describedby="basic-addon1"'
								+ ' id=user_name'
							+ '>'
						+ '</div>'
						+ '<br>'
						+ '<br>'
						+ '<div class="input-group">'
							+'<span class="input-group-addon">'
								+ 'Password'
							+ '</span>'
							+'<input'

								+ ' type="text"'
								+ ' class="form-control"'
								+ ' placeholder="password"'
								+ ' aria-describedby="basic-addon1"'
								+ ' id=password'
							+ '>'
						+ '</div><br>'
					);
				},
				'buttons' : function() {
					return (
						'<button'
							+ ' class="btn btn-default"'
							+ ' id=login'
							+ ' type=button'
							+ ' style="background-image:linear-gradient(to bottom,#FFF 0,#FFF 100%)"'
						+ '>'
							+ 'Login'
						+ '</button>'
						+ '&nbsp'
						+ '<button'
							+ ' class="btn btn-default"'
							+ ' id=registration'
							+ ' type=button'
							+ ' style="background-image:linear-gradient(to bottom,#FFF 0,#FFF 100%)"'
						+ '>'
							+ 'Registration'
						+ '</button>'
					);
				},
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'login::listen',
			}),
		]),
		'login::listen' : new Combine([
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('#login');
				},
				'type' : 'next',
				'new_state' : 'login::save_cookie',
			}),
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('#registration');
				},
				'type' : 'next',
				'new_state' : 'login::create_new_user',
			}),
		]),
		'login::save_cookie' : new Combine([
			new Executer(function(context) {
				create_cookie('user_name', $('#user_name').val());
				create_cookie('user_hash', MD5($('#password').val() + $('#user_name').val()), 30);
			}),
			new GoTo({
				'type' : 'exit_state',
				'new_state' : 'start',
			}),
		]),
		'login::create_new_user' : new SendQuery({
			'ajax_data' : function(context) {
				return {
					'module' : 'User',
					'type' : 'add',
					'user_name' : $('#user_name').val(),
					'user_hash' : MD5($('#password').val() + $('#user_name').val()),
				};
			},
			'type' : 'next',
			'new_state' : 'login::save_cookie',
		}),
		'draw_menu' : new Combine([
			new Builder({
				'container' : $('#menu'),
				'func' : function(context, container) {
					container.append(side_menu());
				}
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::draw_start_page',
			}),
		]),
		'draw_menu::draw_start_page' : new Combine(get_menu_bind_config(0, 'next').concat([
			new Builder({
				'container' : function() {
					return $('#head');
				},
				'func' : function(context, container) {
					container.append('<span style="top-padding:10px">Some text of start page.</span>');
				},
			}),
			new Builder({
				'container' : function() {
					return $('#content');
				},
				'func' : function(context, container) {
					container.append(`<span>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lectus orci, viverra nec neque non, tincidunt commodo leo. Nullam eleifend velit purus, id aliquam elit venenatis sit amet. Cras vel nisl eget eros tempus viverra. Phasellus in enim et nulla tempor blandit. Donec at lectus sit amet velit faucibus tincidunt quis sed est. Mauris placerat purus odio. In egestas, velit quis congue sodales, turpis lacus pellentesque neque, quis accumsan orci nibh sed mauris. Sed sit amet pulvinar felis. Aliquam consequat tellus non ligula elementum, at egestas quam vestibulum. Duis sed urna sit amet quam rutrum malesuada sed eu risus. Cras sit amet velit a neque tincidunt cursus sed ac nunc. Donec ac auctor purus. Proin viverra turpis sit amet dui sagittis, quis tempor elit suscipit. Curabitur rutrum lacus et diam lacinia, vel ullamcorper libero vulputate. Phasellus sem ligula, pharetra sed nisl sed, facilisis sagittis ante. Nullam egestas turpis et mauris aliquet cursus. Nullam vel eleifend neque.
						</span>`
					);
				},
			}),
		])),
		'draw_menu::show_all_boards': new Combine([
			new SendQuery({
				'ajax_data' : function() {
					return {
						'module' : 'Board',
						'type' : 'get_names',
					};
				},
				'write_to' : 'board_names',
				'type' : 'next',
				'new_state' : 'draw_menu::draw_boards_names',
			}),
		]),
		'draw_menu::draw_boards_names' : new Combine([
			new Builder({
				'container' : function() {
					return $('#head');
				},
				'func' : function(context, container) {
					container.append('<span style="top-padding:10px"> Boards. </span>');
				},
			}),
			new Builder({
				'container' : $('#content'),
				'func' : function(context, container) {
					context.board_id_by_name = {};
					var board_list = '<tr>';
					for (var index = 0; index < context.board_names.length; ++index) {
						context.board_id_by_name[context.board_names[index].Name] = context.board_names[index].Id;
						board_list += (
							'<td><div class=board id='
							+ context.board_names[index].Name
							+ '>'
							+ context.board_names[index].Name
							+ '</div></td>'
							);
						if (index + 1 != context.board_names.length && (index + 1) % 4 == 0) {
							board_list += '</tr><tr>'
						}
					}
					board_list += '</tr>';
					container.append(`
						<button type="button" class="btn btn-default" id=create_new_board>
							<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> New Board
						</button>
					`);
					container.append('<table>' + board_list + '</table>');
				},
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::draw_boards_names::listen',
			}),
		]),
		'draw_menu::draw_boards_names::listen' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('.board');
				},
				'write_to' : 'chosen_board_name',
				'type' : 'next',
				'new_state' : 'draw_menu::draw_boards_names::save_board_name',
			}),
			new Binder({
				'action' : 'click',
		       		'target' : function() {
					return $('#create_new_board');
				},
				'type' : 'next',
				'new_state' : 'draw_menu::draw_boards_names::create_new_board_dialog',
			}),
		])),
		'draw_menu::draw_boards_names::save_board_name' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Executer(function(context) {
				context.parent.parent.board_name = context.chosen_board_name.attr('id');
				context.parent.parent.board_id =
					context.parent.board_id_by_name[context.parent.parent.board_name];
			}),
			new GoTo({
				'type' : 'exit_state',
				'new_state' : 'draw_menu::edit_board',
			}),
		])),
		'draw_menu::draw_boards_names::create_new_board_dialog' : new Combine([
			new BDialog({
				'id' : 'create_new_board_dialog',
				'title' : 'Create new board.',
				'data' : function(context) {
					return (
						'<div class="input-group">'
							+'<span class="input-group-addon" id="basic-addon1">'
										+ 'Board name'
							+ '</span>'
							+'<input'

								+ ' type="text"'
								+ ' class="form-control"'
								+ ' placeholder="new_board_name"'
								+ ' aria-describedby="basic-addon1"'
								+ ' id=new_board_name'
							+ '>'
						+ '</div><br>'
					);
				},
				'buttons' : '<button id=Ok type="button" class="btn btn-default">Ok</button>',
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::draw_boards_names::create_new_board_dialog::listen',
			}),
		]),
		'draw_menu::draw_boards_names::create_new_board_dialog::listen' : new Combine([
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('#Ok');
				},
				'type' : 'next',
				'new_state' : 'draw_menu::draw_boards_names::create_new_board_dialog::check_board_name',
			}),
			new Binder({
				'target' : function() {
					return $('#close');
				},
				'action' : 'click',
				'type' : 'exit_state',
				'new_state' : 'draw_menu::draw_boards_names::listen',
			}),
		]),
		'draw_menu::draw_boards_names::create_new_board_dialog::check_board_name' : new GoTo({
			'type' : 'next',
			'new_state' : function(context) {
				for (var index = 0; index < context.parent.parent.board_names.length; ++index) {
					if (context.parent.parent.board_names[index].Name == $('#new_board_name').val()) {
						alert('Board with name ' +  $('#new_board_name').val() + ' already exists.');
						return 'draw_menu::draw_boards_names::create_new_board_dialog::listen';
					}
				}
				context.parent.parent.parent.board_name = $('#new_board_name').val()
				return 'draw_menu::draw_boards_names::create_new_board_dialog::save_new_board';
			}
		}),
		'draw_menu::draw_boards_names::create_new_board_dialog::save_new_board' : new SendQuery({
			'ajax_data' : function(context) {
				return {
					'module' : 'Board',
					'type' : 'add',
					'name' : $('#new_board_name').val(),
				};
			},
			'write_to' : 'board_id',
			'type' : 'next',
			'new_state' : 'draw_menu::draw_boards_names::create_new_board_dialog::save_board_id',
		}),
		'draw_menu::draw_boards_names::create_new_board_dialog::save_board_id' : new Combine([
			new Executer(function(context) {
				context.parent.parent.parent.board_id = context.board_id;
			}),
			new GoTo({
				'type' : 'exit_state',
				'depth' : 2,
				'new_state' : 'draw_menu::edit_board',
			}),
		]),
		'draw_menu::edit_board' : new Combine(get_menu_bind_config(0, 'next').concat([
			new Builder({
				'container' : function() {
					return $('#send_message_box');
				},
				'func' : function(context, container) {
					container.append(get_send_message_html());
				},
			}),
			new Builder({
				'container' : function() {
					return $('#addition_content');
				},
				'func' : function(context, container) {
					container.append(`
						<div
							style="
								margin:0px;
								font-size:50px;
								color:#000;
								background-size:contain;
								width:120px;
								height:90px;
								padding-left=0px
							"
						> </div>
						<div
							style="
								background:url(http://rick-morty.ru/wp-content/uploads/2014/07/cropped-mr-meeseeks-wallpaper-11.png);
								opacity:0.9;
								margin:0px;
								font-size:50px;
								color:#000;
								background-size:contain;
								width:1180px;
								height:90px;
								padding-left=0px;
								position:fixed;
								top:0px
							"
						> </div>
					`);
				}
			}),
			new Builder({
				'container' : function() {
					return $('#content');
				},
				'func' : function(context, container) {
					container.append('<div id=messages style="width:100%;"></div>');
				},
			}),
			new Builder({
				'container' : function() {
					return $('#head');
				},
				'func' : function(context, container) {
					container.append('<span>' + context.parent.board_name + '<span>');
				},
			}),
			new Executer(function(context){
				loadjscssfile("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js", "js");
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),
		])),
		'draw_menu::edit_board::listen' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Binder({
				'action' : 'click',
	    			'target' : function() {
					return $('#send_message');
				},
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::send_message',
			}),
			new Enabler({
				'target' : function () {
					return $('#message_text');
				},
			}),
			new Timer({
				'timeout' : 100,
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),
		])),
		'draw_menu::edit_board::send_message' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'Message',
						'type' : 'add',
						'text' : $('#message_text').val(),
						'user_hash' : read_cookie('user_hash'),
						'board_id' : context.parent.parent.board_id,
					};
				},
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::clean_message',
			}),
		])),
		'draw_menu::edit_board::clean_message' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Executer(function(context) {
				$('#message_text').val("");
			}),
			new GoTo({
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),
		])),
		'draw_menu::edit_board::get_messages' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Binder({
				'action' : 'click',
	    			'target' : function() {
					return $('#send_message');
				},
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::send_message',
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
						'board_name' : context.board_name,
						'condition' : 'BoardId=' + context.parent.parent.board_id,
					};
				},
				'write_to' : 'messages',
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::draw_messages',
			}),


		])),
		'draw_menu::edit_board::draw_messages' : new Combine([
			new Executer(function(context) {
				var html = [];
				for (var i = 0; i < context.messages.length; ++i) {
					var date = new Date(context.messages[i].Time*1000);
					var head = context.messages[i].UserName
						+ ' '
						+ date.toString()
						+ ' №'
						+ context.messages[i].Id;

					html.push(
						 '<div class="media" style="width:700px">'
							+ '<div class="media-left">'
								+ '<a href="#">'
									+ '<img class="media-object" src="p.svg" alt="..." style="width:100px">'
								+ '</a>'
							+ '</div>'
							+ '<div class="media-body">'
								+ '<h5 class="media-heading">' + head  + '</h5>'
								+ context.messages[i].Message
								/*+ '<div class="media">'
									+ '<div class="media-left">'
										+ '<a href="#">'
											+ '<img class="media-object" src="p.svg" alt="..." style="width:100px">'
										+ '</a>'
									+ '</div>'
									+ '<div class="media-body">'
										+ '<h5 class="media-heading">' + head  + '</h5>'
										+ context.messages[i].Message
									+ '</div>'
								+ '</div>'
								+ '<div class="media">'
									+ '<div class="media-left">'
										+ '<a href="#">'
											+ '<img class="media-object" src="p.svg" style="width:100px">'
										+ '</a>'
									+ '</div>'
									+ '<div class="media-body">'
										+ '<h5 class="media-heading">' + head  + '</h5>'
										+ context.messages[i].Message
									+ '</div>'
								+ '</div>'*/

								+ '</div>'
							+ '</div>'
						+ '</div>'
					);
				}
				$('#messages').html(html.join(""));
			}),
			new GoTo({
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::listen',
			}),
		]),
	});
});


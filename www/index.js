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
				return $('#exit');
			},
		    	'type' : type,
			'depth' : depth,
		    	'new_state' : 'draw_menu::exit',
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
					create_cookie('mode', context.user.Mode);
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
				'new_state' : 'login::check_new_user_name',
			}),
		]),
		'login::check_new_user_name' : new Combine([
			new SendQuery({
				'ajax_data' : function(context) {
					return  {
						'module' : 'User',
						'type' : 'get_by_name',
						'user_name' : $('#user_name').val(),
					};
				},
				'write_to' : 'user',
				'type' : 'next',
				'new_state' : 'login::create_new_user',
			}),
		]),
		'login::check_user' : new Combine([
			new Executer(function(context) {
				if (context.user.Id) {
					alert("User with name such name already exists");
				}
			}),
			new GoTo({
				'type' : 'next',
				'new_state' : function(context) {
					if (context.user.Id) {
						return 'login::listen';
					} else {
						return 'login::save_cookie';
					}
				},
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
					context.image_by_board_id = {};
					var board_list = '<div class="row" style="z-index: -1;">';
					for (var index = 0; index < context.board_names.length; ++index) {
						context.board_id_by_name[context.board_names[index].Name] =
							context.board_names[index].Id;
						context.image_by_board_id[context.board_names[index].Id] =
							context.board_names[index].Image
						image = "";

						if (context.board_names[index].Image == 1) {
							image =  ' <img '
										+ 'src=boards_images/'
											+ context.board_names[index].Id
											+ '.png'
				//http://rick-morty.ru/wp-content/uploads/2014/07/cropped-mr-meeseeks-wallpaper-11.png"'
										+ ' style="opacity:0.5"'
									+ '>'

						}
						var delete_btn = '';
						if (read_cookie('mode') > 0) {
							delete_btn = (
								'&nbsp;&nbsp;&nbsp;'
								+ '<a'
									+ ' href="#"'
									+ ' class="btn btn-primary delete-board"'
									+ ' role="button"'
									+ ' id="'
										+ context.board_names[index].Id
									+ '"'
								+ '>'
									+ 'Delete'
								+ '</a>'

							);
						}
						board_list += (
							'<div class="col-sm-6 col-md-4" style="width: 345px;">'
								+ '<div class="thumbnail" style="padding-left: 15px;width: 330px;">'
									+ image
									+ '<div class="caption">'
										+ '<h3>'
											+ context.board_names[index].Name
										+ '</h3>'
										+ '<p style="word-wrap: break-word;">'
											+ context.board_names[index].Title
										+ '</p>'
										+ '<p>'
											+ '<a'
												+ ' href="#"'
												+ ' class="btn btn-default board"'
												+ ' role="button"'
												+ ' id="'
													+ context.board_names[index].Name
												+ '"'
											+ '>'
												+ 'Go!'
											+ '</a>'
											+ delete_btn
										+ '</p>'
      									+ '</div>'
								+ '</div>'
							+ '</div>'
						);
						if (index + 1 != context.board_names.length && (index + 1) % 3 == 0) {
							board_list += '</div><div class="row" style="z-index: -1;">'
						}
					}
					board_list += '</div>';
					container.append(`
						<button type="button" class="btn btn-default" id=create_new_board>
							+ New Board
						</button>
						<br><br>
					`);
					container.append(board_list);
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
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('.delete-board');
				},
				'write_to' : 'chosen_board_to_delete',
				'type' : 'next',
				'new_state' : 'draw_menu::delete_board',
			}),
		])),
		'draw_menu::delete_board' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'Board',
						'type' : 'delete',
						'board_id' : context.chosen_board_to_delete.attr('id'),
						'user_hash' : read_cookie('user_hash'),
					};
				},
				'type' : 'exit_state',
				'new_state' : 'draw_menu::show_all_boards',
			}),
		])),
		'draw_menu::draw_boards_names::save_board_name' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Executer(function(context) {
				context.parent.parent.board_name = context.chosen_board_name.attr('id');
				context.parent.parent.board_id =
					context.parent.board_id_by_name[
						context.parent.parent.board_name
					];
				context.parent.parent.image =
					context.parent.image_by_board_id[
						context.parent.parent.board_id
					];
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
						+ '<div class="input-group">'
							+'<span class="input-group-addon" id="basic-addon1">'
										+ 'Title'
							+ '</span>'
							+'<input'

								+ ' type="text"'
								+ ' class="form-control"'
								+ ' placeholder="new_board_title"'
								+ ' aria-describedby="basic-addon1"'
								+ ' id=new_board_title'
							+ '>'
						+ '</div><br>'
						+ '<div class="input-group">'
							+ '<input type="file" class="filestyle" data-badge="false" id="image">'
						+ '</div>'


					);
				},
				'buttons' : '<button id=Ok type="button" class="btn btn-default">Ok</button>',
			}),
			new Executer(function(context){
				loadjscssfile("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js", "js");
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
					'title' : $('#new_board_title').val(),
				};
			},
			'file_input' : function() {
				return $('#image');
			},

			'write_to' : 'board_info',
			'type' : 'next',
			'new_state' : 'draw_menu::draw_boards_names::create_new_board_dialog::save_board_id',
		}),
		'draw_menu::draw_boards_names::create_new_board_dialog::save_board_id' : new Combine([
			new Executer(function(context) {
				context.parent.parent.parent.board_id = context.board_info.Id;
				context.parent.parent.parent.image = context.board_info.Image;
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
					if (context.parent.image == 0) {
						return;
					}
					container.append(
						'<div'
							+ ' style="'
								+ 'margin:0px;'
								+ 'font-size:50px;'
								+ 'color:#000;'
								+ 'background-size:contain;'
								+ 'width:120px;'
								+ 'height:90px;'
								+ 'padding-left=0px'
							+ '"'
						+ '> </div>'
						+ '<div'
							+ ' style="'
								+ 'background-image:'
										+ 'url(boards_images\/'
											+ context.parent.board_id
								+ '.png);'
								+ 'opacity:0.9;'
								+ 'margin:0px;'
								+ 'font-size:50px;'
								+ 'color:#000;'
								+ 'background-size:contain;'
								+ 'width:1180px;'
								+ 'height:90px;'
								+ 'padding-left:0px;'
								+ 'position:fixed;'
								+ 'top:0px'
							+ '"'
						+ '> </div>'
					);
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
					container.append('<h3>' + context.parent.board_name + '</h3>');
				},
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),
		])),
		'draw_menu::edit_board::listen' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Executer(function(context){
				loadjscssfile("http://markusslima.github.io/bootstrap-filestyle/js/bootstrap-filestyle.min.js", "js");
			}),

			new Binder({
				'action' : 'click',
	    			'target' : function() {
					return $('#send_message');
				},
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::send_message',
			}),
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('.message_to_delete');
				},
				'write_to' : 'message',
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::delete_message',
			}),
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('.lock_user');
				},
				'write_to' : 'user_to_lock',
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::lock_user',
			}),

			new Enabler({
				'target' : function () {
					return $('#message_text');
				},
			}),
			new Timer({
				'timeout' : 1,
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),
		])),
		'draw_menu::edit_board::lock_user' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'User',
						'type' : 'lock',
						'user_hash' : read_cookie('user_hash'),
						'user_to_lock' : context.user_to_lock.attr('id'),
					};
				},
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::get_messages',
			}),

		])),
		'draw_menu::edit_board::delete_message' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'Message',
						'type' : 'delete',
						'user_hash' : read_cookie('user_hash'),
						'condition' : 'Messages.Id=' + context.message.attr('id'),
					};
				},
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
				'file_input' : function() {
					return $('#image');
				},
				'write_to' : 'result',
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::check_status',
			}),
		])),
		'draw_menu::edit_board::check_status' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Executer(function(context) {
				if (context.result.Status == -1) {
					alert(context.result.Respond);
				}
			}),
			new GoTo({
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
						'type' : 'get_messages_for_board',
						'board_name' : context.board_name,
						'board_id' : context.parent.parent.board_id,
						'condition' : 'BoardId=' + context.parent.parent.board_id,
						'user_hash' : read_cookie('user_hash'),
					};
				},
				'write_to' : 'board_content',
				'type' : 'next',
				'new_state' : 'draw_menu::edit_board::draw_messages',
			}),


		])),
		'draw_menu::edit_board::draw_messages' : new Combine([
			new Executer(function(context) {
				if (context.board_content.Status == -1) {
					return;
				}
				var html = [];
				var messages = context.board_content.Messages;


				for (var i = 0; i < messages.length; ++i) {
					var delete_btn = '';
					var st = '';
					if (read_cookie('mode') > 0) {
						delete_btn = (
							'&nbsp;&nbsp;&nbsp;'
							+ '<span'
								+ ' class="label label-primary message_to_delete"'
								+ ' id=' + messages[i].Id
							+ '>'
								+ 'Delete'
							+ '</span>'
						);
						if (messages[i].BanMode == 1) {
							st =
								'&nbsp;&nbsp;&nbsp;'
								+ '<span'
									+ ' class="label label-primary lock_user"'
									+ ' id=' + messages[i].UserHash
								+ '>'
									+ 'Unlock'
								+ '</span>';

						}  else {
							st =
								'&nbsp;&nbsp;&nbsp;'
								+ '<span'
									+ ' class="label label-primary lock_user"'
									+ ' id=' + messages[i].UserHash
								+ '>'
									+ 'Lock'
								+ '</span>';
						}

					}

					var date = new Date(messages[i].Time*1000);
				       	var head = messages[i].UserName
						+ ' '
						+ date.toString()
						+ ' №'
						+ messages[i].Id;

					var image = '';
					if (messages[i].Image == "1") {
						var image_name = (
							'messages_images/'
							+ messages[i].Id
							+ '.png'
						);
						image = (
							'<div class="media-left">'
								+ '<a'
							       		+ ' href="'
										+ image_name
									+ '"'
									+ ' target="_blank"'
								+ '>'
									+ '<img'
								       		+ ' class="media-object"'
									       	+ ' src="'
											+ image_name
										+ '"'
										+ ' style="width:100px"'
									+ '>'
								+ '</a>'
							+ '</div>'
						);

					}
					html.push(
						 '<div class="media" style="width:700px">'
							+ image
						 	+ '<div class="media-body">'
								+ '<h5 class="media-heading">'
									+ head
									+ delete_btn
									+ st
								+ '</h5>'
								+ messages[i].Message
							+ '</div>'
						+ '</div>'
					);
				}
				$('#messages').html(
					'<h3>Visitors number: '
					+ context.board_content.BoardsVisitors
					+ ' </h3>'
					+ html.join("")
				);
			}),
			new GoTo({
				'type' : function(context) {
					if (context.board_content.Status == 1) {
						return 'next';
					} else {
						return 'exit_state';
					}
				},
				'new_state' : function(context) {
					if (context.board_content.Status == 1) {
						return 'draw_menu::edit_board::listen';
					} else {
						return 'draw_menu::show_all_boards';
					}
				},
			}),
		]),
		'draw_menu::show_all_messages' : new Combine(get_menu_bind_config(0, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function(context) {
					return {
						'module' : 'Message',
						'type' : 'get',
						'condition' : "Messages.UserHash='" + read_cookie('user_hash') + "'",
					};
				},
				'write_to' : 'messages',
				'type' : 'next',
				'new_state' : 'draw_menu::draw_users_messages',
			}),
		])),
		'draw_menu::draw_users_messages' :  new Combine(get_menu_bind_config(0, 'exit_state').concat([
			new Builder({
				'container' :function() {
					return $('#content');
				},
				'func' : function (context, container) {
					var messages = '<table cellpadding=10px>';
					if (!context.messages.length) {
						container.append('You have no message.');
					}


					for (var i = 0; i < context.messages.length; ++i) {
						var date = new Date(context.messages[i].Time*1000);
						var head = context.messages[i].UserName
							+ ' '
							+ date.toString()
							+ ' №'
							+ context.messages[i].Id;
						var image = '';
						if (context.messages[i].Image == "1") {
							var image_name = (
								'messages_images/'
								+ context.messages[i].Id
								+ '.png'
							);
							image = (
								'<div class="media-left">'
									+ '<a'
										+ ' href="'
											+ image_name
										+ '"'
										+ ' target="_blank"'
									+ '>'
										+ '<img'
											+ ' class="media-object"'
											+ ' src="'
												+ image_name
											+ '"'
											+ ' style="width:100px"'
										+ '>'
									+ '</a>'
								+ '</div>'
							);
						}


						messages +=
							'<tr>'
								+ '<td style="padding-left:10px; padding-top:10px">'
									+ '<div class="media" style="width:700px">'
										+ image
								 		+ '<div class="media-body">'
											+ '<h5 class="media-heading">'
												+ head
											+ '</h5>'
											+ context.messages[i].Message
										+ '</div>'
									+ '</div>'
								+ '</td>'
								+ '<td>'
									+ '<span'
										+ ' class="label label-primary"'
									       	+ ' id=' + context.messages[i].Id
									+ '>'
										+ 'Delete'
									+ '</span>'
								+ '</td>'

							+ '</tr>'

					}

					container.append(messages + '</table>');
				}
			}),
			new Builder({
				'container' : function() {
					return $('#head');
				},
				'func' : function(context, container) {
					container.append('<h3>Your messages</h3>');
				}
			}),
			new GoTo({
				'type' : 'substate',
				'new_state' : 'draw_menu::draw_users_messages::listen',
			}),
		])),
		'draw_menu::draw_users_messages::listen' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new Binder({
				'action' : 'click',
				'target' : function() {
					return $('.label');
				},
				'write_to' : 'message',
				'type' : 'next',
				'new_state' : 'draw_menu::draw_users_messages::delete_message',
			}),

		])),
		'draw_menu::draw_users_messages::delete_message' : new Combine(get_menu_bind_config(1, 'exit_state').concat([
			new SendQuery({
				'ajax_data' : function (context) {
					return {
						'module' : 'Message',
						'type' : 'delete',
						'condition' : 'Messages.Id=' + context.message.attr('id'),
						'user_hash' : read_cookie('user_hash'),
					};
				},
				'type' : 'exit_state',
				'new_state' : 'draw_menu::show_all_messages',
			}),
		])),

		'draw_menu::exit' : new Combine(get_menu_bind_config(0, 'exit_state').concat([
			new Executer(function(context) {
				erase_cookie('user_hash');
				erase_cookie('user_name');
			}),

			new GoTo({
				'type' : 'exit_state',
				'new_state' : 'start',
			}),
		])),

	});
});


function get_send_message_html() {
	return '<div class="message_box">'
		+ '<aside'
	       		+ ' id="sidebar"'
		       	+ ' class="sidebar sidebar-default open"'
		       	+ ' role="navigation"'
		       	+ ' style="width:300px;min-height:280px"'
		+ '>'
 			+ '<div'
		       		+ ' class="sidebar-header header-cover"'
				+ ' style="'
					+ 'background-image: url(https://41.media.tumblr.com/550002b988539d7ae1140a384f0c5dbf/tumblr_ne7qri0o8c1tli2c9o1_1280.png);'
					+ 'height: 46px;'
				+'"'
			+ '>'
				+ '<a class="sidebar-brand">'
					+ 'Create Message'
				+ '</a>'
			+ '</div>'
			+ '<ul'
		       		+ ' class="nav sidebar-nav"'
			       	+ ' style="padding-right:10px;padding-left:10px;padding-bottom:7px"'
			+ '>'
				+ '<div class="input-group">'
						+ '<span class="input-group-addon">Text</span>'
						+ '<textarea'
							+ ' class="form-control"'
							+ ' id=message_text'
							+ ' placeholder="Text of the message..."'
							+ ' disabled'
						+ '></textarea>'
				+ '</div>'
				+ '<br>'
				+ '<div class="input-group">'
					+ '<input type="file" class="filestyle" data-badge="false" id="image">'
				+ '</div>'
				+ '<br>'
				+ '<li class="divider" style="width:300px; padding-right:0px"></li>'
				+ '<li>'
					+ '<button'
						+ ' class="btn btn-default"'
							+ ' id=send_message'
							+ ' type=button'
							+ ' style="background-image:linear-gradient(to bottom,#FFF 0,#FFF 100%)"'
						+ '>'
							+ 'Send Message'
						+ '</button>'
					+ '</li>'
				+ '</div>'
			+ '</ul>'
		+ '</aside>'
	+ '</div>';
}

function side_menu() {
	return `
		<div class="sidebar-overlay"></div>
		<aside id="sidebar" class="sidebar sidebar-default open" role="navigation" style="width:220px;height:100%;position:fixed">
			<div class="sidebar-header header-cover" style="background-image: url(https://41.media.tumblr.com/550002b988539d7ae1140a384f0c5dbf/tumblr_ne7qri0o8c1tli2c9o1_1280.png);">
				<div class="sidebar-image">
					<img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png">
				</div>
				<a class="sidebar-brand">
					UserName
				</a>
			</div>

			<ul class="nav sidebar-nav" style="position:fixed">
				<li>
					<a href="#" id=all_boards>
						<i class="sidebar-icon md-star" ></i>
							All boards
					</a>
				</li>
				<li class="divider" style="width:220px"></li>
				<li class="dropdown">
					<a class="ripple-effect dropdown-toggle" href="#" data-toggle="dropdown">
						All Messages
						<b class="caret"></b>
					</a>
					<ul class="dropdown-menu">
						<li>
							<a href="#" tabindex="-1" id=all_messages>
								Your Messages
							</a>
						</li>
						<li>
							<a href="#" tabindex="-1" id=all_comments>
								Your Comments
							</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#" id=all_images>
						All Images
					</a>
				</li>
				<li>
					<a href="#" id=answers>
						Answers
						<span class="sidebar-badge">N</span>
					</a>
				</li>
				<li class="divider" style="width:220px"></li>
				<li class="dropdown">
					<a class="ripple-effect dropdown-toggle" href="#" data-toggle="dropdown">
						Profile
						<b class="caret"></b>
					</a>

					<ul class="dropdown-menu">
						<li>
							<a href="#" tabindex="-1" id=settings>
								Settings
							</a>
						</li>
						<li>
							<a href="#" tabindex="-1" id=exit>
								Exit
							</a>
						</li>
					</ul>
				</li>

			</ul>
		</aside>
		<div style="left:0px;width:220px;height:100%"></div>
	`

}

/*function create_page_content(head, body) {
	return '<div'
		+ ' class="page-header"'
		+ ' style="'
			+ ' font-size:30px;'
			+ ' color:#000;'
			+ ' background-size:contain;'
			+ ' margin:0px 0 10px;'
			+ ' position:fixed;'
			+ ' background-color:#F5F5F3;'
			+ ' width:700px"'
		+ '>'
			+ head
		+ '</div>'
		+ '<div'
			+ ' style="'
				+ ' font-size:30px;'
				+ ' color:#000;'
				+ ' background-size:contain;'
				+ ' margin:10px 0 10px;'
				+ ' opacity:0;'
			+ '"'
		+ '>'
			+ 'Some text'
		+ '</div>'
		+ '<div class="side-body" style="padding-top:15px">'
			+ body
		+ '</div>'

}
*/
function get_start_page_content() {
	return create_page_content(
		'<div>'
			+ '<span> Start Page With Some Content</span>'
		+ '</div>',
		'<div style="width:100%">'
			+ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lectus orci, viverra nec neque non, tincidunt commodo leo. Nullam eleifend velit purus, id aliquam elit venenatis sit amet. Cras vel nisl eget eros tempus viverra. Phasellus in enim et nulla tempor blandit. Donec at lectus sit amet velit faucibus tincidunt quis sed est. Mauris placerat purus odio. In egestas, velit quis congue sodales, turpis lacus pellentesque neque, quis accumsan orci nibh sed mauris. Sed sit amet pulvinar felis. Aliquam consequat tellus non ligula elementum, at egestas quam vestibulum. Duis sed urna sit amet quam rutrum malesuada sed eu risus. Cras sit amet velit a neque tincidunt cursus sed ac nunc. Donec ac auctor purus. Proin viverra turpis sit amet dui sagittis, quis tempor elit suscipit. Curabitur rutrum lacus et diam lacinia, vel ullamcorper libero vulputate. Phasellus sem ligula, pharetra sed nisl sed, facilisis sagittis ante. Nullam egestas turpis et mauris aliquet cursus. Nullam vel eleifend neque.'
			+ '</div>'

	);
}


function get_board_head(picture_ref) {
		return `
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
			>
			</div>
			<div
				style="
					background:` + picture_ref  + `;
					opacity:0.9;
					margin:0px;
					font-size:50px;
					color:#000;
					background-size:contain;
					width:1020px;
					height:90px;
					padding-left=0px;
					position:fixed;
					top:0px
				"
			>
			</div>
		`
}

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

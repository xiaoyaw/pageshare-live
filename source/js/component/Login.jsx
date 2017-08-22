import {
	Router,
	Route,
	hashHistory
} from 'react-router';
var React = require('react');

var Login = React.createClass({
	getInitialState: function() {
		var isEnglish=this.getLanguage();
		var language=this.setLanguage(isEnglish);
		return {
			language:language,
			value: null,
			width: '',
			warning: ''
		};
	},
	componentWillMount: function() {
		this.calLogoSize();
	},
	componentDidMount: function() {
		if (this.isMounted()) {
			var thiz = this;
			$('#guestlogin').on('click', function() {
				document.getElementById('us').disabled="disabled";
				document.getElementById('pw').disabled="disabled";
			});
			$('#login').on('click', function() {
				if($('#us').attr("disabled")=="disabled"){
					var room=$('#roomid').val();
					if(room!=""){
						thiz.getcode("guest", "111111");
					}else{
						thiz.setState({
							warning: thiz.state.language.nullroom
						}, function() {
							thiz.handleMsg();
						});
					}
				}else{
					var un = $('#us').val();
					var pw = $('#pw').val();
					var room=$('#roomid').val();
					if (un != '' && pw != ''&&room!='') {
						thiz.getcode(un, pw);
					} else {
						thiz.setState({
							warning: thiz.state.language.nullInput
						}, function() {
							thiz.handleMsg();
						});
					}
				}
			
			});
		}
	},
	calLogoSize: function() {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (w > h) {
			this.setState({
				width: '35%'
			});
		} else {
			this.setState({
				width: '80%'
			});
		}
	},
	getcode: function(user, pass) {
		var thiz = this;
		$.post("http://www.pictoshare.net/index.php?controller=apis&action=login", {
				login_info: user,
				password: pass
			},
			function(data, status) {
				if (data != '') {
					var value = JSON.parse(data);
					thiz.setState({
						value: value
					}, function() {
						if (thiz.state.value.status == "success") {
							thiz.getUserInfo(thiz.state.value.tokenkey);
						} else {
							thiz.setState({
								warning: thiz.state.language.wrong1
							}, function() {
								thiz.handleMsg();
							});
						}
					});
				} else {
					thiz.setState({
						warning: thiz.state.language.wrong2
					}, function() {
						thiz.handleMsg();
					});
				}
			});
	},
	getUserInfo: function(token) {
		var thiz = this;
		$.post("http://www.pictoshare.net/index.php?controller=apis&action=getmemberinfo", {
				tokenkey: token
			},
			function(data, status) {
				var value = JSON.parse(data);
				if (value.status == "success") {
					var un = value.info.username;
					var pw = value.info.password;
					thiz.localSave(un, pw);
					if (un != '' && un != null && pw != '' && pw != null) {
						hashHistory.replace('/live/'+$('#roomid').val());
					}
				} else {
					thiz.setState({
						warning: thiz.state.language.wrong3
					}, function() {
						thiz.handleMsg();
					});
				}
			});
	},
	localSave: function(u, p) {
		if (typeof(Storage) !== "undefined") {
			sessionStorage.setItem("username", u);
			sessionStorage.setItem("password", p);
		}
	},
	handleMsg: function() {
		$('#warning').fadeIn();
		setTimeout(function() {
			$('#warning').fadeOut();
		}, 2000);
	},
	handleResize:function(e){
		this.calLogoSize();
	},
	getLanguage:function(){
		var language=navigator.browserLanguage || navigator.language;
		if(language.substring(0,2)=="zh"){
			return false;
		}else{
			return true;
		}
	},
	setLanguage:function(isEnglish){
		if(isEnglish){
			return {
				usa:"Username",
				room:"RoomId",
				pwd:"Password",
				guest:"guest",
				login:"Sign in",
				nullInput:"Please enter your account number and password !",
				nullroom:"Please enter the roomid",
				wrong1:"Incorrect input ！",
				wrong2:"The number of digits is incorrect ！",
				wrong3:"The server is busy now ！"
			}
		}else{
			return {
				usa:"用户名",
				pwd:"密码",
				room:"房间号",
				guest:"游客登录",
				login:"登录",
				nullroom:'请输入房间号',
				nullInput:"输入不完整",
				wrong1:"输入有误 ！",
				wrong2:"密码位数不正确 ！",
				wrong3:"服务器繁忙 ！"
			}
		}
	},
	render: function() {
		return ( < div className = "container"
			style = {
				{
					width: this.state.width
				}
			} >
			< div className = "form-signin" >
			<img src="img/pageshare.png" className="logo"/> <br/ ><br/ >< input id = "us"
			className = "form-control"
			placeholder = {this.state.language.usa}
			required = "" / >
			<br/>
			< input id = "pw"
			className = "form-control"
			placeholder = {this.state.language.pwd}
			required = ""
			type = "password" / >
			<br/>
			< input id = "roomid"
			className = "form-control"
			placeholder = {this.state.language.room}
			required = "" / >
			< div className = "checkbox pull-right" >
			< label >
			< a id = 'guestlogin' > {this.state.language.guest} < /a> < /label > < /div > < button className = "btn btn-lg btn-primary btn-block"
			type = "submit"
			id = 'login' > {this.state.language.login} < /button> < div style = {
				{
					textAlign: 'center',
					textShadow: '2px 2px 5px #9B30FF',
					marginTop: '35px',
					display: 'none'
				}
			}
			id = "warning" > < font style = {
				{
					fontSize: '16px'
				}
			} > {
				this.state.warning
			} < /font></div >
			< /div >
			< /div >
		);
	}

});

module.exports = Login;
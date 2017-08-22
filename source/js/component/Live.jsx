import Loading from './Loading.jsx';
import Slider from './Slider.jsx';

import {
	Router,
	Route,
	hashHistory
} from 'react-router';
var React = require('react');


var Live = React.createClass({
	getInitialState: function() {
	var isChinese=(navigator.language||navigator.browserLanguage).substring(0,2)=="zh";
	var client = AgoraRTC.createClient({mode: 'interop'});
		return {
			isChinese:isChinese,
			client:client,
			height:'',
			width:'',
			nickname:"pageshare",
			transform:0,
			stream:'',
			roomID:'',
			honzontal:false,
			ishonzontal:false
		};
	},
	componentWillMount:function(){
		if(sessionStorage.username){
			var size=this.setWH();
			this.setState({
				width:size.width,
				height:size.height,
				nickname:sessionStorage.getItem("username") 
			});
		}else{
			hashHistory.replace('/');
		}

	},
	setWH:function(){
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-2;
		return {
			width:h*607/810,
			height:h
			}
	},

	componentDidMount:function(){
		if(this.isMounted()&&sessionStorage.username){
			var thiz=this;
			var channel=this.props.params.id;
			this.setState({
				roomID:channel 
			});
			var client=this.state.client;
  			var channelKey = "";
			client.init("a434998f08b94f20af63e37b4836d1a4", function () {
    			//console.log("AgoraRTC client initialized");
				 client.join(null, channel, null, function(uid) {
      			//	console.log("User " + uid + " join channel successfully");
    			}, function(err) {
     				 console.log("Join channel failed", err);
    			});
			}, function (err) {
    				console.log("AgoraRTC client init failed", err);
 			});

			client.on('error', function(err) {
    			//console.log("Got error msg:", err.reason);
    			if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
     				client.renewChannelKey(channelKey, function(){
        				//console.log("Renew channel key successfully");
      				}, function(err){
        				//console.log("Renew channel key failed: ", err);
      				});
    			}
  			});

  			client.on('stream-added', function (evt) {
    			var stream = evt.stream;
    			//console.log("New stream added: " + stream.getId());
    			//console.log("Subscribe ", stream);
    			client.subscribe(stream, function (err) {
      			//	console.log("Subscribe stream failed", err);
   				 });
  			});
  			client.on('stream-subscribed', function (evt) {
    			var stream = evt.stream;
    			thiz.setState({
    				stream:stream 
    			});
    			//console.log("Subscribe remote stream successfully: " + stream.getId());
    			if ($('div#video #agora_remote'+stream.getId()).length === 0) {
      				$('div#video').html('<div id="agora_remote'+stream.getId()+'" style="width:100%;height:100%;display:inline-block;"></div>');
   				 	//stream.setVideoProfile('720P_3');
   				 }
    			stream.play('agora_remote' + stream.getId());
  			});
		}
	},

	joinLiveRoom:function(id){
  			var dynamic_key = null;
  			var client = this.state.client;
				 client.join(dynamic_key, id, null, function(uid) {
      				console.log("User " + uid + " join channel successfully");
    			}, function(err) {
     				 console.log("Join channel failed", err);
    			});
   
	},
	handleExchange:function(e){
		var value=$('#input_roomid').val();
		var thiz=this;
		if(value!=''){
			this.setState({
				roomID:value 
			},function(){
				if(this.state.stream!=''){
					this.state.stream.stop();
				}
				this.state.client.leave(function () {
    				thiz.joinLiveRoom(value);
  				}, function (err) {
  				 	sessionStorage.clear();
    		 		hashHistory.replace("/");
  				});
			});
		}
	},

	handleExit:function(e){
		var stream=this.state.stream;
		this.state.client.leave(function () {
			if(stream!=''){
				stream.stop();
			}
    		sessionStorage.clear();
    		hashHistory.replace("/");
  		}, function (err) {
  			 sessionStorage.clear();
    		 hashHistory.replace("/");
  		});
	},

	handleVertical:function(e){
		if(this.state.ishonzontal){
			var w=this.state.width,
			h=this.state.height;
			$("#live_container").css("transform","rotate(0deg)");
			$('#live_container').animate({
				width:w,
				height:h
			});	
			this.setState({
				ishonzontal:false 
			});		
		}
	},

	handleRight:function(e){
		var thiz=this;
		var w=this.state.width,
		h=this.state.height;
		if(this.state.transform%180==0){
			$('#live_container').animate({
				width:h,
				height:h
			},function(){
				var deg=thiz.state.transform+90;
				thiz.setState({
					transform:deg 
				},function(){
					$("#live_container").css("transform","rotate("+deg+"deg)");
				});
			})
		}else{
			var deg=thiz.state.transform+90;
				thiz.setState({
					transform:deg 
				},function(){
					$("#live_container").css("transform","rotate("+deg+"deg)");
				});
			$('#live_container').animate({
				width:w,
				height:h
			})
		}
	},

	handleLeft:function(e){
		var thiz=this;
		var w=this.state.width,
		h=this.state.height;
		if(this.state.transform%180==0){
			$('#live_container').animate({
				width:h,
				height:w
			},function(){
				var deg=thiz.state.transform-90;
				thiz.setState({
					transform:deg 
				},function(){
					$("#live_container").css("transform","rotate("+deg+"deg)");
				});
			})
		}else{
			var deg=thiz.state.transform-90;
				thiz.setState({
					transform:deg 
				},function(){
					$("#live_container").css("transform","rotate("+deg+"deg)");
				});
			$('#live_container').animate({
				width:w,
				height:h
			})
		}
	},
	handleHorizontal:function(e){
		if(!this.state.ishonzontal){
			var thiz=this;
			var w=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			h=this.state.height;
			if(this.state.honzontal){
				$('#live_container').animate({
					width:h,
					height:w-25
				},function(){
					thiz.setState({
						ishonzontal:true,
						honzontal:!thiz.state.honzontal 
					},function(){
						$("#live_container").css("transform","rotate(270deg)");
					});
				})	
			}else{
				$('#live_container').animate({
					width:h,
					height:w-25
				},function(){
					thiz.setState({
						ishonzontal:true,
						honzontal:!thiz.state.honzontal 
					},function(){
						$("#live_container").css("transform","rotate(90deg)");
					});
				})	
			}
		}else{
			if(this.state.honzontal){
					this.setState({
						honzontal:!this.state.honzontal 
					},function(){
						$("#live_container").css("transform","rotate(90deg)");
					});
			}else{
					this.setState({
						honzontal:!this.state.honzontal 
					},function(){
						$("#live_container").css("transform","rotate(270deg)");
					});
			}
		}
	},

	render: function() {
		var text=this.state.isChinese?{msg1:"换播",msg2:"退出",msg3:"请输入直播间ID",msg4:"确定"}:{msg1:"Exchange",
		msg2:"Exit",msg3:"Please enter the inter-broadcast ID",msg4:"Sure"}
		return (
			<div>
				<div 
				id="live_container"
					style={
						{
							position:"relative",
							width:this.state.width,
							height:this.state.height
						}
					}>
					<div id="video"
					 style={
						{	textAlign:"center",
							width:"100%",
							height:"100%"
						}

					}>
						<Loading className="child"/>
					</div>
				</div>
				<Slider _roomid={this.state.roomID}/>
				<div className="util-container">

						<div className="util-item">
							<button type="button" className="btn btn-default" data-toggle="modal" data-target="#live_input">
          					<span className="glyphicon glyphicon-retweet"></span>
        					</button>
        				</div>

						<div className="util-item">
							<button type="button" className="btn btn-default" onClick={this.handleVertical}>
          					<span className="glyphicon glyphicon-resize-vertical"></span>
        					</button>
        				</div>

						<div className="util-item">
							<button type="button" className="btn btn-default" onClick={this.handleHorizontal}>
          					<span className="glyphicon glyphicon-resize-horizontal"></span>
        					</button>
						</div>

						<div className="util-item">
							<button type="button" className="btn btn-default" onClick={this.handleExit}>
          					<span className="glyphicon glyphicon-log-out"></span>
        					</button>
						</div>

				</div>
				<div className="modal" id="live_input" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
								</button>
								<h4 className="modal-title" id="myModalLabel">
									{text.msg3}
								</h4>
							</div>
							<div className="modal-body">
								<input className="input-room" id="input_roomid"/>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.handleExchange}>{text.msg4}
								</button>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}

});

module.exports = Live;
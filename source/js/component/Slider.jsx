var React = require('react');

var Slider = React.createClass({

	getInitialState: function() {
		return {
			left: 50,
			top: 140,
			isMouseDown: false,
			downX: null, //按下的x坐标
			downY: null, //按下的y坐标
			dx: null, //对于父组件的x坐标
			dy: null, //相对于父组件的y坐标
			isMove: false
		};
	},
	componentDidMount: function() {
		if (this.isMounted()) {
			var moveX, moveY;
			var hastouch = "ontouchstart" in window ? true : false, //判断是否为移动设备
				slideStart = hastouch ? "touchstart" : "mousedown",
				slideMove = hastouch ? "touchmove" : "mousemove",
				slideEnd = hastouch ? "touchend" : "mouseup";
			var objectSlider = hastouch ? this.refs.slider : window;
			var thiz = this;
			var slider = this.refs.slider;
			slider.addEventListener(slideStart, function(e) {
				var x = hastouch ? e.targetTouches[0].pageX : e.pageX;
				var y = hastouch ? e.targetTouches[0].pageY : e.pageY;
				var w = hastouch ? e.targetTouches[0].pageX - thiz.state.left : e.pageX - thiz.state.left;
				var h = hastouch ? e.targetTouches[0].pageY - thiz.state.top : e.pageY - thiz.state.top;
				//alert(w);
				thiz.setState({
					isMouseDown: true,
					downX: x,
					downY: y,
					dx: x - w,
					dy: y - h
				});
				e.preventDefault();
			}, false);
			objectSlider.addEventListener(slideMove, function(ev) {
				if (thiz.state.isMouseDown) {
					moveX = hastouch ? ev.targetTouches[0].pageX : ev.pageX;
					moveY = hastouch ? ev.targetTouches[0].pageY : ev.pageY;
					thiz.setState({
						isMove: true,
						left: thiz.state.dx + moveX - thiz.state.downX,
						top: thiz.state.dy + moveY - thiz.state.downY
					});
				}
				ev.preventDefault();
			}, false);
			slider.addEventListener(slideEnd, function(ev) {
				if (thiz.state.isMove) {
					thiz.setState({
						isMove: false
					});
					ev.preventDefault();
				}
				thiz.setState({
					isMouseDown: false,
				});
			}, false);
		}
	},
	render: function() {
		var name;
		var shadow = this.state.isMouseDown ? '0px 0px 20px #0AFFB6' : '0px 0px 20px #73FAFF';
		var roomid = this.props._roomid;
		return ( < div ref = "slider"
					id='slider'
			style = {
				{	overflow: "hidden",
					textOverflow:"ellipsis",
					whiteSpace: "nowrap",
					boxShadow: shadow,
					borderRadius: '50%',
					backgroundColor: '#F0F8FF',
					textAlign: 'center',
					lineHeight: '80px',
					width: '80px',
					height: '80px',
					position: 'absolute',
					left: this.state.left,
					top: this.state.top,
					zIndex: 999,
					opacity: 0.8,
					cursor: 'pointer',
					color:"#A020F0"
				}
			} >
			{
				roomid
			} < /div > );
	}

});


module.exports = Slider;
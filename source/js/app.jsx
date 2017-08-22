import React from 'react';
import ReactDOM from 'react-dom';
import {
	Router,
	Route,
	hashHistory
} from 'react-router';
import Login from './component/Login.jsx';
import Live from './component/Live.jsx'

	ReactDOM.render(
 <Router history={hashHistory}>
 	<Route path="/" component={Login}/>
 	<Route path="/live/:id" component={Live}/>
</Router>,document.getElementById('app'));
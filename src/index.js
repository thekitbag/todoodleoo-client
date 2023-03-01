import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Project from './Project/Project.js';
import Header from './Header/Header.js'
import Login from './Login/Login.js'
import Register from './Register/Register.js'
import { Board } from './Board/Board.js'
import { List } from './Board/List.js'
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from "./serviceWorker";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <Router>
     <div className='container'>
       <Header />
       <div className='container'>
         <Switch>
          <Route exact path="/" component={ Project }/>
          <Route path="/login" component={ Login }/>
          <Route path="/register" component={ Register }/>
          <Route path="/board" component={ Board }/>
          <Route path="/list" component={ List }/>
         </Switch>
      </div>
    </div>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

serviceWorker.register();


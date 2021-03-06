import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from "react-router-dom"
import Recommend from "./recommend/Recommend"
import Ranking from "./ranking/Ranking"
import SingerList from "./singer/SingerList"
import Search from "../containers/Search"
import logo from "../assets/imgs/logo.png"
import '../assets/stylus/reset.styl'
import './App.styl'
import "../assets/stylus/font.styl"
//import Player from "../containers/Player"
import MusicPlayer from "./play/MusicPlayer"


class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <h1 className="app-title">Mango Music</h1>
          </header>
          <div className="music-tab">
            <div className="tab-item selected">
              <NavLink to="/recommend" className="nav-link">
                <span>推荐</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/ranking" className="nav-link">
                <span>排行榜</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/singer" className="nav-link">
                <span>歌手</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/search" className="nav-link">
                <span>搜索</span>
              </NavLink>
            </div>
          </div>
          <div className="music-view">
            {/*
              Switch组件用来选择最近的一个路由，否则最后一个没有指定path的路由也会显示
              Redirect重定向到列表页
            */}
            <Switch>
              <Route path="/recommend" component={Recommend} />
              <Route path="/ranking" component={Ranking} />
              <Route path="/singer" component={SingerList} />
              <Route path="/search" component={Search} />
              <Redirect from="/" to="/recommend" />
              {/*<Route component={Ranking} />*/}
            </Switch>
          </div>
          {/*<Player/>*/}
          <MusicPlayer/>
        </div>
      </Router>
    );
  }
}

export default App;

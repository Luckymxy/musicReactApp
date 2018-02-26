import React from "react";
import ReactDOM from "react-dom"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import { getRankingInfo } from "@/api/ranking"
import { createRankingByDetail } from "@/model/ranking"
import * as songModel from "@/model/song"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS } from "@/api/config"
import { CSSTransition } from 'react-transition-group'
import { getTransitionEndName } from '@/util/event'

import "./rankinginfo.styl"

class RankingInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: true,
            ranking: {},
            songs: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        this.setState({
            show: true
        })

        let rankingBgDom = ReactDOM.findDOMNode(this.refs.rankingBg);
        let rankingContainerDOM = ReactDOM.findDOMNode(this.refs.rankingContainer);
        rankingContainerDOM.style.top = rankingBgDom.offsetHeight + "px";

        getRankingInfo(this.props.match.params.id).then(res => {
            console.log("获取排行榜详情：");
            if (res) {
                console.log(res)
                if (res.code === CODE_SUCCESS) {
                    let ranking = createRankingByDetail(res.topinfo)
                    ranking.info = res.topinfo.info;
                    let songList = [];
                    res.songlist.forEach(item => {
                        if (item.data.pay.payplay === 1)  return; 
                        let song = songModel.createSong(item.data);
                        this.getSongUrl(song, item.data.songmid)
                        songList.push(song)
                    });

                    this.setState({
                        loading: false,
                        ranking: ranking,
                        songs: songList
                    }, () => {
                        this.setState({
                            refreshScroll: true
                        })
                    }) 

                }
            }
        })

        this.initMusicIco();

    }

    getSongUrl(song, mId) {
        getSongVKey(mId).then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    if (res.data.items) {
                        let item = res.data.items[0];
                        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                    }
                }
            }
        });
    }

    scroll = ({y}) => {
        let headerDOM = ReactDOM.findDOMNode(this.refs.header);
        let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg); 
        let rankingFixedBgDOM = ReactDOM.findDOMNode(this.refs.rankingFixedBg); 
        if (y < 0) {
            if (Math.abs(parseInt(y)) + headerDOM.offsetHeight > rankingBgDOM.offsetHeight) {
                rankingFixedBgDOM.style.display = "block";
            }else {
                rankingFixedBgDOM.style.display = "none";
            } 
        }else {
            let transform = 'scale('+ (1 + y * 0.004) +','+ (1 + y * 0.004) +')'
            rankingBgDOM.style.webkitTransform = transform;
            rankingBgDOM.style.transform = transform;
        }
    }

    playAll = () => {
        if (this.state.songs.length > 0) {
            this.props.setSongs(this.state.songs);
            this.props.changeCurrentSong(this.state.songs[0]);
            this.props.showMusicPlayer(true);
        }
    }

    selectSong = (song) => {
        return (e) => {
            let songs = [...this.props.songsList];
            let notExist = true;
            for (var value of songs) {
                if (value.id === song.id) {
                    notExist = false;
                    break;
                }
            }
            if (notExist)  songs.push(song);
            this.props.setSongs(songs);
            this.props.changeCurrentSong(song);
            this.startMusicIcoAnimation(e.nativeEvent);
        }
    }

    startMusicIcoAnimation = ({clientX,clientY}) => {
        if (this.musicIcos.length > 0) {
            for(var v of this.musicIcos){
              if (v.run === false) {
                    v.style.left = clientX + "px";
                    v.style.top = clientY + "px";
                    v.style.display = "inline-block";
                    setTimeout(() => {
                        v.run = true;
                        v.style["webkitTransform"] = "translate3d(0,1000px,0)";
                        v.style["transform"] = "translate3d(0,1000px,0)";
                        let icon = v.querySelector("div");
                        icon.style["webkitTransform"] = "translate3d(-30px,0,0)";
                        icon.style["transform"] = "translate3d(-30px,0,0)";
                    },0) // 当在transition完成前移除transition时，比如移除css的transition-property 属性，事件将不会被触发.如在transition完成前设置 display 为"none"，事件同样不会被触发。这里就是v的css样式设置了display:“none”，这里用setTimeOut即可解决
 
                break;
                }
            }
        }
    }

    initMusicIco = () => {
        this.musicIcos = [];
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIcon1));
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIcon2));
        this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIcon3));
        
        this.musicIcos.forEach((item) => {
            item.run = false;
            let transitionEndName = getTransitionEndName(item);
            item.addEventListener(transitionEndName, () => {
                //ES6的匿名函数的话，this和ES5写法不同
                //es6写法 this就是Album组件， es5写法function(){}  this就是当前item
                //console.log(this)
                item.style.display = "none";
                item.style["webkitTransform"] = "translate3d(0, 0, 0)";
                item.style["transform"] = "translate3d(0, 0, 0)";
                item.run = false;
                let icon = item.querySelector("div");
                icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
                icon.style["transform"] = "translate3d(0, 0, 0)";
            },false);
        })
    }

    render() {
        let ranking = this.state.ranking;
        //console.log(this.state.songs);
        let songs = this.state.songs.map((item, i) => {
            return (
                <div className="song" key={item.id} onClick={this.selectSong(item)}>
                    <div className="song-index">{i + 1}</div>
                    <div className="song-name">{item.name}</div>
                    <div className="song-singer">{item.singer}</div>
                </div>
            )
        });
        return (
            <CSSTransition classNames="translate" timeout={300} in={this.state.show}>
                <div className="ranking-info">
                    <Header title={ranking.title} ref="header"/>
                    <div style={{ position: "relative" }}>
                        <div ref="rankingBg" className="ranking-img" style={{ backgroundImage: `url(${ranking.img})` }}>
                            <div className="filter"></div>
                        </div>
                        <div ref="rankingFixedBg" className="ranking-img fixed" style={{ backgroundImage: `url(${ranking.img})` }}>
                            <div className="filter"></div>
                        </div>
                        <div className="play-wrapper" ref="playButtonWrapper">
                            <div className="play-button" onClick={this.playAll}>
                                <i className="icon-play"></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div ref="rankingContainer" className="ranking-container">
                        <div className="ranking-scroll" style={this.state.loading === true ? { display: "none" } : { }}>
                            <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                                <div className="ranking-wrapper">
                                    <div className="ranking-count">排行榜 共{songs.length}首</div>
                                    <div className="song-list">
                                        {songs}
                                    </div>
                                    <div className="info" style={ranking.info ? {} : { display: "none" }}>
                                        <h1 className="ranking-title">简介</h1>
                                        <div className="ranking-desc">
                                            {ranking.info}
                                        </div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                        <Loading title="正在加载..." show={this.state.loading} />
                    </div>
                    <div className="music-ico" ref="musicIcon1">
                        <div className="icon-fe-music"></div>
                    </div>
                    <div className="music-ico" ref="musicIcon2">
                        <div className="icon-fe-music"></div>
                    </div>
                    <div className="music-ico" ref="musicIcon3">
                        <div className="icon-fe-music"></div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default RankingInfo
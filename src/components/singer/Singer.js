import React from "react"
import ReactDOM from 'react-dom'
import {CSSTransition} from "react-transition-group"
import Header from "@/common/header/Header"
import Loading from "@/common/loading/Loading"
import Scroll from "@/common/scroll/Scroll"
import {getSingerInfo} from "@/api/singer"
import {getSongVKey} from "@/api/song"
import {CODE_SUCCESS} from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as SongModel from "@/model/song"
import { getTransitionEndName } from '@/util/event'

import './singer.styl'


class Singer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: true,
            singer: {},
            songs: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        this.setState({
            show: true
        });

        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";
        
        getSingerInfo(this.props.match.params.id).then(res => {
             console.log("获取歌手详情：");
             if (res) {
                 //console.log(res)
                 if (res.code === CODE_SUCCESS) {
                    let singer = SingerModel.createSingerByDetail(res.data);
                    let songList = res.data.list;
                    let songs = [];
                    songList.forEach(item => {
                        if (item.musicData.pay.payplay === 1) { return }
                        let song = SongModel.createSong(item.musicData);
                        this.getSongUrl(song,song.mId)
                        songs.push(song);
                    })
                    this.setState({
                        songs,
                        singer,
                        loading: false
                    },() => {
                        this.setState({
                            refreshScroll: true
                        })
                    })
                 }
             }
        })

        this.initMusicIco();
    }

    scroll = ({y}) => {
        let headerDOM = ReactDOM.findDOMNode(this.refs.header);
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg); 
        let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg); 
        if (y < 0) {
            if (Math.abs(parseInt(y)) + headerDOM.offsetHeight > albumBgDOM.offsetHeight) {
                albumFixedBgDOM.style.display = "block";
            }else {
                albumFixedBgDOM.style.display = "none";
            } 
        }else {
            let transform = 'scale('+ (1 + y * 0.004) +','+ (1 + y * 0.004) +')'
            albumBgDOM.style.webkitTransform = transform;
            albumBgDOM.style.transform = transform;
        }
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

    playAll = () => {
        if (this.state.songs.length > 0) {
            this.props.setSongs(this.state.songs);
            this.props.changeCurrentSong(this.state.songs[0]);
            this.props.showMusicPlayer(true);
          
            this.props.audioReload(true);
        }
    }

    selectSong = (song) => {
        return (e) => {
            let songs = [...this.props.songsList];
            let notExist = true;
            for (var value of songs) {
                if (value.id === song.id) {
                    notExist = false;
                    this.props.audioReload(true);
                    break;
                }
            }
            if (notExist)  songs.push(song);
            this.props.setSongs(songs);
            this.props.changeCurrentSong(song);
            this.startMusicIcoAnimation(e.nativeEvent);
        }
    }

    render () {
        let singer = this.state.singer;
        let songs = this.state.songs.map((song) => {
            return (
                <div className="song" key={song.id} onClick={this.selectSong(song)}>
                    <div className="song-name">{song.name}</div>
                    <div className="song-singer">{song.singer}</div>
                </div>    
            )
        })

        return (
           <CSSTransition classNames="translate" timeout={300} in={this.state.show}>
                <div className="music-singer">
                     <Header title={singer.name} ref="header"/>
                     <div style={{position:"relative"}}>
                        <div ref="albumBg" className="singer-img" style={{"backgroundImage":`url(${singer.img})`}}>
                            <div className="filter"></div>
                        </div>
                        <div ref="albumFixedBg" className="singer-img fixed" style={{"backgroundImage":`url(${singer.img})`}}>
                             <div className="filter"></div>
                        </div>
                        <div className="play-wrapper" ref="playButtonWrapper">
                            <div className="play-button" onClick={this.playAll}>
                                <i className="icon-play"></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                     </div>
                     <div ref="albumContainer" className="singer-container">
                        <div className="singer-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
                            <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                                <div className="singer-wrapper">
                                    <div className="song-count">歌曲 共{songs.length}首</div>
                                    <div className="song-list">
                                        {songs}
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

export default Singer 
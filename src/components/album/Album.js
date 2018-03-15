import React from 'react'
import ReactDOM from 'react-dom'
import {CSSTransition} from 'react-transition-group'
import './album.styl'
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import {getAlbumInfo} from "@/api/recommend"
import {CODE_SUCCESS} from "@/api/config"
import {getSongVKey} from "@/api/song"
import {getTransitionEndName} from "@/util/event"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"


class Album extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            loading: true,
            album: {},
            songs: [],
            refreshScroll: false,
            show: false
        }
    }

     componentDidMount() {
        this.setState({
            show: true
    });


        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";

        getAlbumInfo(this.props.match.params.id).then((res) => {
            console.log("获取专辑详情：");
            if (res) {
                //console.log(res)
                if (res.code === CODE_SUCCESS) {
                    let album = AlbumModel.createAlbumByDetail(res.data);
                    album.desc = res.data.desc;

                    let songList = res.data.list;
                    let songs = [];
                    songList.forEach(item => {
                        let song = SongModel.createSong(item);
                        this.getSongUrl(song, item.songmid);
                        songs.push(song);
                    });
                    this.setState({
                        loading: false,
                        album: album,
                        songs: songs
                    }, () => {
                        //刷新scroll
                        this.setState({refreshScroll:true});
                    });
                }
            }
        });

        this.initMusicIco();
    }

    getSongUrl(song, mId) {
        getSongVKey(mId).then((res) => {
            if (res) {
                if(res.code === CODE_SUCCESS) {
                    if(res.data.items) {
                        let item = res.data.items[0];
                        song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                    }
                }
            }
        });
    }

    scroll = ({y}) => {
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg);
        let headerDOM = ReactDOM.findDOMNode(this.refs.header);
        //let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
        if (y < 0) { //y<0表示滚动页面还在上方
            if (Math.abs(y) + headerDOM.offsetHeight > albumBgDOM.offsetHeight) {
                albumFixedBgDOM.style.display = "block";
            } else {
                albumFixedBgDOM.style.display = "none";
            }
        }else {
            let transform = `scale( ${ 1 + y * 0.004 }, ${ 1 + y * 0.004 } )`;
            albumBgDOM.style.webkitTransform = transform;
            albumBgDOM.style.transform = transform;
            //playButtonWrapperDOM.style.bottom = `${ 20 - y }px`;
        }
    }
    
    playAll = () => {
        if (this.state.songs.length > 0) {
            //所有的修改都是围绕着store（reducers）中state的数据来
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
        //console.log(this.props);       
        let album = this.state.album;
        let songs = this.state.songs.map((song) => {
            return (
                <div className="song" key={song.id} onClick={this.selectSong(song)}>
                    <div className="song-name">{song.name}</div>
                    <div className="song-singer">{song.singer}</div>
                </div>
            );
        });
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames="translate" > 
                  {/*动画。当in为true时，组件的子元素会应用translate-enter、translate-enter-active样式，当in为false时，组件的子元素会应用translate-exit、translate-exit-active样式。*/}
                <div className="music-album">
                    <Header title={album.name} ref="header"></Header>
                    <div style={{position:"relative"}}>
                        <div ref="albumBg" className="album-img" style={{backgroundImage: `url(${album.img})`}}>
                            <div className="filter"></div>
                        </div>
                        <div ref="albumFixedBg" className="album-img fixed" style={{backgroundImage: `url(${album.img})`}}>
                            <div className="filter"></div>
                        </div>
                        <div className="play-wrapper" ref="playButtonWrapper">
                            <div className="play-button" onClick={this.playAll}>
                                <i className="icon-play"></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div ref="albumContainer" className="album-container">
                        <div className="album-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
                            <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                                <div className="album-wrapper">
                                    <div className="song-count">专辑 共{songs.length}首</div>
                                    <div className="song-list">
                                        {songs}
                                    </div>
                                    <div className="album-info" style={album.desc? {} : {display:"none"}}>
                                        <h1 className="album-title">专辑简介</h1>
                                        <div className="album-desc">
                                            {album.desc}
                                        </div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                        <Loading title="正在加载..." show={this.state.loading}/>
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
        );
    }

}

export default Album

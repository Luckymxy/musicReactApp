import React from "react"
import Loading from "@/common/loading/Loading"
import Scroll from "@/common/scroll/Scroll"
import { getHotKey, search } from "@/api/search"
import { CODE_SUCCESS } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"
import { Route } from "react-router-dom"
import Album from "@/containers/Album"
import Singer from "@/containers/Singer"
import { getSongVKey } from "@/api/song"
import ReactDOM from "react-dom"
import {getTransitionEndName} from "@/util/event.js"

import "./search.styl"


class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hotKeys: [],
            singer: {},
            album: {},
            songs: [],
            w: "",
            loading: false
        };
    }

    componentDidMount() {
        getHotKey().then(res => {
            console.log("获取热搜：");
            if (res) {
                //console.log(res);
                if (res.code === CODE_SUCCESS) {
                    this.setState({
                        hotKeys: res.data.hotkey
                    });
                }
            }
        })
        this.initMusicIco();
    }

    search = (w) => {
        this.setState({ w, loading: true });
        search(w).then(res => {
            console.log("搜索：");
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    let zhida = res.data.zhida;
                    let type = zhida.type;
                    let singer = {};
                    let album = {};

                    switch (type) {
                        case 0:
                            break;
                        //表示歌手
                        case 2:
                            singer = SingerModel.createSingerBySearch(zhida);
                            singer.songnum = zhida.songnum;
                            singer.albumnum = zhida.albumnum;
                            break;
                        //表示专辑    
                        case 3:
                            album = AlbumModel.createAlbumBySearch(zhida);
                            break;
                        default:
                            break;
                    }
                    let songs = [];
                    res.data.song.list.forEach((data) => {
                        if (data.pay.payplay === 1) { return }
                        songs.push(SongModel.createSong(data));
                    });
                    this.setState({
                        album: album,
                        singer: singer,
                        songs: songs,
                        loading: false
                    }, () => {
                        this.refs.scroll.bScroll.refresh();
                    });
                }
            }
        })
    }

    handleInput = (e) => {
        console.log(e)
        let w = e.currentTarget.value;
        this.setState({
            w,
            singer: {},
            album: {},
            songs: []
        })
    }

    handleEnter = (e) => {
        if (e.which === 13) {
            this.search(this.state.w);
            console.log(this)
        }
    }

    handleClick = (data, type) => {
        return (e) => {
            switch (type) {
                case "album":
                console.log(1)
                    this.props.history.push({
                        pathname: `${this.props.match.url + '/album/' + data}`
                    })
                    break;
                case "singer":
                    this.props.history.push({
                        pathname: `${this.props.match.url + '/singer/' + data}`
                    })
                    break;
                case "song":
                    this.startMusicIcoAnimation(e.nativeEvent);
                    getSongVKey(data.mId).then((res) => {
                        if (res) {
                            if (res.code === CODE_SUCCESS) {
                                let item = res.data.items[0];
                                data.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                                let songs = [...this.props.songsList];
                                let notExist = true;
                                for (var value of songs) {
                                    if (value.id === data.id) {
                                        notExist = false;
                                        this.props.audioReload(true);
                                        break;
                                    }
                                }
                                if (notExist) songs.push(data);
                                this.props.setSongs(songs);
                                this.props.changeCurrentSong(data);
                            }
                        }
                    })
                    break;
                default:
                    break;
            }

        }
    }

    startMusicIcoAnimation = ({ clientX, clientY }) => {
        if (this.musicIcos.length > 0) {
            for (var v of this.musicIcos) {
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
                    }, 0) // 当在transition完成前移除transition时，比如移除css的transition-property 属性，事件将不会被触发.如在transition完成前设置 display 为"none"，事件同样不会被触发。这里就是v的css样式设置了display:“none”，这里用setTimeOut即可解决

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
            }, false);
        })
    }

    render() {
        let album = this.state.album;
        let singer = this.state.singer;
        return (
            <div className="music-search">
                <div className="search-box-wrapper">
                    <div className="search-box">
                        <i className="icon-search"></i>
                        <input type="text" className="search-input" placeholder="搜索歌曲、歌手、专辑"
                            //在React中，可变的状态通常保存在组件的状态属性中，并且只能用 setState()方法进行更新
                            //受控组件就是React负责渲染表单的组件然后控制用户后续输入时所发生的变化
                            value={this.state.w}  //value已经只能由this.state.w来控制， 输入不起作用， 需要onChange时间
                            onChange={this.handleInput}
                            onKeyDown={this.handleEnter}
                        />
                    </div>
                    <div className="cancel-button" style={{ display: this.state.w ? "block" : "none" }}
                        onClick={() => {
                            this.setState({
                                w: "",
                                singer: {},
                                album: {},
                                songs: []
                            })
                        }}>
                        取消
                    </div>
                </div>
                <div className="search-hot" style={{ display: this.state.w ? "none" : "block" }}>
                    <h1 className="title">热门搜索</h1>
                    <div className="hot-list">
                        {
                            this.state.hotKeys.map((hot, index) => {
                                if (index > 10) return "";
                                return (
                                    <div className="hot-item" key={index} onClick={() => { this.search(hot.k) }}>{hot.k}</div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="search-result skin-search-result" style={{ display: this.state.w ? "block" : "none" }}>
                    <Scroll ref="scroll">
                        <div>
                            {/*专辑*/}
                            <div className="album-wrapper" style={{ display: album.id ? "block" : "none" }}
                                onClick={this.handleClick(album.mId, "album")}>
                                <div className="left">
                                    <img src={album.img} alt={album.name} />
                                </div>
                                <div className="right">
                                    <div className="song">{album.name}</div>
                                    <div className="singer">{album.singer}</div>
                                </div>
                            </div>
                            {/*歌手*/}
                            <div className="singer-wrapper" style={{ display: singer.id ? "block" : "none" }}
                            onClick={this.handleClick(singer.mId, "singer")}>
                                <div className="left">
                                    <img src={singer.img} alt={singer.name} />
                                </div>
                                <div className="right">
                                    <div className="singer">{singer.name}</div>
                                    <div className="info">单曲{singer.songnum} 专辑{singer.albumnum}</div>
                                </div>
                            </div>
                            {/*歌曲列表*/}
                            {
                                this.state.songs.map((song) => {
                                    return (
                                        <div className="song-wrapper" key={song.id}
                                            onClick={this.handleClick(song, "song")}>
                                            <div className="left icon-fe-music">
                                                {/*<img src={require('@/assets/imgs/music.png')} alt={song.name}/>*/}
                                            </div>
                                            <div className="right">
                                                <div className="song">{song.name}</div>
                                                <div className="singer">{song.singer}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Loading title="正在加载..." show={this.state.loading} />
                    </Scroll>
                </div>
                <Route path={`${this.props.match.url}/album/:id`} component={Album} />
                <Route path={`${this.props.match.url}/singer/:id`} component={Singer} />
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
        );
    }
}

export default Search
import React from "react"
import Loading from "@/common/loading/Loading"
import Scroll from "@/common/scroll/Scroll"
import { getHotKey, search } from "@/api/search"
import { CODE_SUCCESS } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"

import "./search.styl"


class Recommend extends React.Component {
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
                        this.refs.scroll.Bscroll.refresh();
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
            singer:{},
            album: {},
            songs: []
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
                            value={this.state.w} 
                            onChange={this.handleInput}
                            />
                    </div>
                    <div className="cancel-button" style={{ display: this.state.w ? "block" : "none" }}>取消</div>
                </div>
                <div className="search-hot" style={{ display: this.state.w ? "none" : "block" }}>
                    <h1 className="title">热门搜索</h1>
                    <div className="hot-list">
                        {
                            this.state.hotKeys.map((hot, index) => {
                                if (index > 10) return "";
                                return (
                                    <div className="hot-item" key={index}>{hot.k}</div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="search-result skin-search-result" style={{ display: this.state.w ? "block" : "none" }}>
                    <Scroll ref="scroll">
                        <div>
                            {/*专辑*/}
                            <div className="album-wrapper" style={{ display: album.id ? "block" : "none" }}>
                                ...
                            <div className="right">
                                    <div className="song">{album.name}</div>
                                    <div className="singer">{album.singer}</div>
                                </div>
                            </div>
                            {/*歌手*/}
                            <div className="singer-wrapper" style={{ display: singer.id ? "block" : "none" }}>
                                ...
                            <div className="right">
                                    <div className="singer">{singer.name}</div>
                                    <div className="info">单曲{singer.songnum} 专辑{singer.albumnum}</div>
                                </div>
                            </div>
                            {/*歌曲列表*/}
                            {
                                this.state.songs.map((song) => {
                                    return (
                                        <div className="song-wrapper" key={song.id}>
                                            ...
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
            </div>
        );
    }
}

export default Recommend
import React from "react"
import ReactDOM from "react-dom"
import { Song } from "@/model/song"
import Progress from "./Progress"
import MiniPlayer from "./MiniPlayer"
import { CSSTransition } from "react-transition-group"
// import MiniPlayer from "./MiniPlayer";

import "./player.styl"

class Player extends React.Component {
    constructor(props) {
        super(props);
        //audio在移动端未触摸屏幕第一次是无法自动播放的，  
        this.isFirstPlay = true;
        //播放时间currentTime，播放进度playProgress，
        //播放状态playStatus和当前播放模式currentPlayMode交给播放组件的state管理，
        //把当前播放歌曲currentSong， 当前播放歌曲的位置currentIndex交给自身

        this.currentSong = new Song(0, "", "", "", 0, "", "");

        this.currentIndex = 0;

        //播放模式： list-列表 single-单曲 shuffle-随机
        this.playModes = ["list", "single", "shuffle"];

        this.state = {
            currentTime: 0,
            playProgress: 0,
            playStatus: false,
            currentPlayMode: 0
        }            //state中改变会渲染到ui层，然后通过props传到Progress组件，达到，播放音频同时改变Progress组件样式的目的

        //记录拖拽进度
        this.dragProgress = 0;
    }
    componentDidMount() {
        this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
        this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
        this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
        this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);
        if (this.isFirstPlay === true) {
            //setTimeout(()=>{this.audioDOM.play();},5000)  还没有audio的src时候就播放了
            // this.audioDOM.play()
            this.isFirstPlay = false;
        };

        this.audioDOM.addEventListener('canplay', () => {
            if (this.props.playSongs.length > 0) {
                for (var i = 0, len = this.props.playSongs.length; i < len; i++) {
                    if (this.props.playSongs[i].id === this.props.currentSong.id) {
                        this.currentIndex = i;
                        break;
                    }
                }
            }
            let currentIndex = this.currentIndex || 0;
            this.props.changeCurrentIndex(currentIndex); //传递当前歌曲的index到MusicPlayer.js再到PlayerList.js
            this.audioDOM.play()
            this.startImgRotate();
            this.setState({
                playStatus: true
            });
        }, false);

        this.audioDOM.addEventListener("timeupdate", () => {
            if (this.state.playStatus === true) {
                this.setState({
                    playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
                    currentTime: this.audioDOM.currentTime
                });
            }
        }, false);

        this.audioDOM.addEventListener('ended', () => {
            if (this.props.playSongs.length > 1) { //播放列表数组长度大于1， 这里是container中的Player redux管理的state
                let currentIndex = this.currentIndex;
                if (this.state.currentPlayMode === 0) {
                    if (currentIndex === (this.props.playSongs.length - 1)) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                } else if (this.state.currentPlayMode === 1) {
                    return;
                } else {
                    let index = parseInt(Math.random() * this.props.playsongs.length, 10);
                    currentIndex = index;
                }
                this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
                this.props.changeCurrentIndex(currentIndex);
                this.currentIndex = currentIndex;
            } else {
                if (this.state.currentPlayMode === 1) {
                    this.audioDOM.play();
                } else {
                    this.audioDOM.pause();
                    this.stopImgRotate();
                    this.setState({
                        playProgress: 0,
                        currentTime: 0,
                        playStatus: false
                    })
                }
            }
        }, false);

        this.audioDOM.addEventListener('error', () => {
            alert('加载歌曲出错');
        })
    }

	/**
	 * 开始旋转图片
	 */
    startImgRotate = () => {
        if (this.singerImgDOM.className.indexOf("rotate") === -1) {
            this.singerImgDOM.classList.add("rotate");
        } else {
            this.singerImgDOM.style["webkitAnimationPlayState"] = "running";
            this.singerImgDOM.style["animationPlayState"] = "running";
        }
    }
	/**
	 * 停止旋转图片
	 */
    stopImgRotate = () => {
        this.singerImgDOM.style["webkitAnimationPlayState"] = "paused";
        this.singerImgDOM.style["animationPlayState"] = "paused";
    }
    //切换播放模式
    changePlayMode = () => {
        if (this.state.currentPlayMode === this.playModes.length - 1) {
            this.setState({ currentPlayMode: 0 });
        } else {
            this.setState({ currentPlayMode: this.state.currentPlayMode + 1 });
        }
    }

    //播放或暂停
    playOrPause = () => {
        if (this.audioDOM.paused) {
            //第一次播放
            if (this.first === undefined) {
                this.audioDOM.src = this.currentSong.url;
                this.first = true;
            }
            this.audioDOM.play();
            this.startImgRotate();

            this.setState({
                playStatus: true
            })
        } else {
            this.audioDOM.pause();
            this.stopImgRotate();

            this.setState({
                playStatus: false
            })
        }
    }

    //上一首 下一首
    previous = () => {
        if (this.props.playSongs.length > 0 && this.props.playSongs.length !== 1) {
            let currentIndex = this.currentIndex;
            if (this.state.currentPlayMode === 0) {
                if (currentIndex === 0) {
                    currentIndex = this.props.playSongs.length - 1;
                } else {
                    currentIndex--;
                }
            } else if (this.state.currentPlayMode === 1) {
                return;
            } else {
                let index = parseInt(Math.random() * this.props.playsongs.length, 10);
                currentIndex = index;
            }
            this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
            //this.currentIndex = currentIndex;
            this.props.changeCurrentIndex(currentIndex);
            this.currentIndex = this.props.currentIndex;
        }
    }
    next = () => {
        if (this.props.playSongs.length > 0 && this.props.playSongs.length !== 1) {
            let currentIndex = this.currentIndex;
            if (this.state.currentPlayMode === 0) {
                if (currentIndex === (this.props.playSongs.length - 1)) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
            } else if (this.state.currentPlayMode === 1) {
                return;
            } else {
                let index = parseInt(Math.random() * this.props.playsongs.length, 10);
                currentIndex = index;
            }
            this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
            //this.currentIndex = currentIndex;
            this.props.changeCurrentIndex(currentIndex);
            this.currentIndex = this.props.currentIndex;
        }
    }

    handleDrag = (progress) => {
        if (this.audioDOM.duration > 0) {
            this.audioDOM.pause();
            this.stopImgRotate();
            this.setState({
                playStatus: false
            })
            this.dragProgress = progress
        }
    }
    handleDragEnd = () => {
        if (this.audioDOM.duration > 0) { //duration音频总长度以秒计。
            let currentTime = this.audioDOM.duration * this.dragProgress;  //handleDrag中传入progress，记录下来，是为了求的这个currentTime，从而确定拖拽后audio的播放时间
            this.setState({
                playProgress: this.dragProgress,
                currentTime: currentTime
            }, () => {
                this.audioDOM.currentTime = currentTime;
                this.audioDOM.play();
                this.startImgRotate();

                this.setState({
                    playStatus: true
                });
                this.dragProgress = 0;
            });
        }
    }

    hidePlayer = () => {
        this.props.showMusicPlayer(false);
    }

    /**
     *播放列表按钮事件
     */
    showPlayList = () => {
        this.props.showList(true);
    }

    render() {
        //console.log(1)       this.props中的全局state改变会直接触发这个render方法，
        // this.audioDOM.src 改变之后会触发audio的canplay方法。

        //从redux中获取当前播放歌曲
        if (this.props.currentSong && this.props.currentSong.url) {
            //当前歌曲发发生变化
            if (this.currentSong.id !== this.props.currentSong.id) {
                this.currentSong = this.props.currentSong;
                if (this.audioDOM) {
                    this.audioDOM.src = this.currentSong.url;
                    //加载资源，ios需要调用此方法
                    this.audioDOM.load();
                }
            }
        }
        let song = this.currentSong;

        let playBg = song.img ? song.img : require("@/assets/imgs/play_bg.jpg");

        //播放按钮样式
        let playButtonClass = this.state.playStatus === true ? "icon-pause" : "icon-play";

        song.playStatus = this.state.playStatus;
        return (
            <div className="player-container">
                <CSSTransition in={this.props.showStatus} timeout={300} classNames="player-rotate"
                    onEnter={() => {
                        this.playerDOM.style.display = "block"  //onEnter在in为true，组件开始变成进入状态时回调，
                    }}
                    onExited={() => {
                        this.playerDOM.style.display = "none" // onExited在in为false，组件状态已经变成离开状态时回调
                    }}>
                    <div className="player" ref="player" >
                        <div className="header">
                            <span className="header-back" onClick={this.hidePlayer}>
                                <i className="icon-back"></i>
                            </span>
                            <div className="header-title">
                                {song.name}
                            </div>
                        </div>
                        <div className="singer-top">
                            <div className="singer">
                                <div className="singer-name">{song.singer}</div>
                            </div>
                        </div>
                        <div className="singer-middle">
                            <div className="singer-img" ref="singerImg">
                                <img src={playBg} alt={song.name} onLoad={
                                    (e) => {
                                        /*图片加载完成后设置背景，防止图片加载过慢导致没有背景*/
                                        this.playerBgDOM.style.backgroundImage = `url("${playBg}")`;
                                    }
                                } />
                            </div>
                        </div>
                        <div className="singer-bottom">
                            <div className="controller-wrapper">
                                <div className="progress-wrapper">
                                    <span className="current-time">{getTime(this.state.currentTime)}</span>
                                    <div className="play-progress">
                                        <Progress progress={this.state.playProgress}
                                            onDrag={this.handleDrag}
                                            onDragEnd={this.handleDragEnd} disableDrag={false} />
                                    </div>
                                    <span className="total-time">{getTime(song.duration)}</span>
                                </div>
                                <div className="play-wrapper">
                                    <div className="play-model-button" onClick={this.changePlayMode}>
                                        <i className={"icon-" + this.playModes[this.state.currentPlayMode] + "-play"}></i>
                                    </div>
                                    <div className="previous-button" onClick={this.previous}>
                                        <i className="icon-previous"></i>
                                    </div>
                                    <div className="play-button" onClick={this.playOrPause}>
                                        <i className={playButtonClass}></i>
                                    </div>
                                    <div className="next-button" onClick={this.next}>
                                        <i className="icon-next"></i>
                                    </div>
                                    <div className="play-list-button" onClick={this.showPlayList}>
                                        <i className="icon-play-list"></i>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="player-bg" ref="playerBg"></div>
                        <audio ref="audio" id="a"></audio>
                    </div>
                </CSSTransition>
                <MiniPlayer song={song} progress={this.state.playProgress}
                    showStatus={this.props.showStatus}
                    showMusicPlayer={this.props.showMusicPlayer}
                    playOrPause={this.playOrPause}
                    next={this.next} />
            </div>
        );
    }
}


function getTime(second) {
    second = Math.floor(second);
    let minute = Math.floor(second / 60);
    second = second - minute * 60;
    return minute + ":" + formatTime(second);
}
function formatTime(time) {
    let timeStr = "00";
    if (time > 0 && time < 10) {
        timeStr = "0" + time;
    } else if (time >= 10) {
        timeStr = time;
    }
    return timeStr;
}

export default Player
import {connect} from "react-redux"
import {showPlayer, changeSong, audioLoad} from "../redux/actions"
import Player from "../components/play/Player"

//映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    showStatus: state.showStatus,
    currentSong: state.song,
    playSongs: state.songs,
    loadStatus: state.loadStatus
});

//映射dispatch到props上
const mapDispatchToProps = (e) => ({                  //connect 封装了dispatch
    showMusicPlayer: (status) => {
        e(showPlayer(status));
    },
    changeCurrentSong: (song) => {
        e(changeSong(song));
    },
    audioReload: (status) => {
        e(audioLoad(status));
    }
});

//将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Player)
import {connect} from "react-redux"
import {removeSong, changeSong} from "../redux/actions"
import PlayerList from "../components/play/PlayerList"

//映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    currentSong: state.song,
    playSongs: state.songs 
});

//映射dispatch到props上
const mapDispatchToProps = (e) => ({                  //connect 封装了dispatch
    changeCurrentSong: (song) => {
        e(changeSong(song));
    },
    removeSong: (id) => {
        e(removeSong(id))
    }
});

//将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(PlayerList)
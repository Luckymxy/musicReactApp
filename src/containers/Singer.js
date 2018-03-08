import {connect} from "react-redux"
import {showPlayer, changeSong, setSongs, audioLoad} from "../redux/actions"
import Singer from "@/components/singer/Singer"

const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) => {
        dispatch(showPlayer(status));
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song));
    },
    setSongs: (songs) => {
        dispatch(setSongs(songs));
    },
    audioReload: (status) => {
        dispatch(audioLoad(status));
    }
});
const mapStateToProps = (state) => ({
    songsList: state.songs
})
export default connect(mapStateToProps, mapDispatchToProps)(Singer)


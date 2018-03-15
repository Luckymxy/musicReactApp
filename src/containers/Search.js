import {connect} from "react-redux"
import { changeSong, setSongs, audioLoad} from "../redux/actions"
import Search from "@/components/search/Search"

const mapDispatchToProps = (dispatch) => ({
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
export default connect(mapStateToProps, mapDispatchToProps)(Search)


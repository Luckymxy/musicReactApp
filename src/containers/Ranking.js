import { connect } from "react-redux"
import { showPlayer, changeSong, setSongs, audioLoad } from "../redux/actions"
import RankingInfo from "@/components/ranking/RankingInfo"


const mapStateToProps = (state) => ({
    songsList: state.songs
})
const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (show) => {
        dispatch(showPlayer(show));
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song))
    },
    setSongs: (songs) => {
        dispatch(setSongs(songs))
    },
    audioReload: (status) => {
        dispatch(audioLoad(status));
    }
}) 

export default connect (mapStateToProps, mapDispatchToProps)(RankingInfo);
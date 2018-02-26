import {connect} from "react-redux"
import {showPlayer, changeSong, setSongs} from "../redux/actions"
import Album from "../components/album/Album"


const mapStateToProps = (state) => ({
    songsList: state.songs
})
//映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) => {
        dispatch(showPlayer(status));
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song));
    },
    setSongs: (songs) => {
        dispatch(setSongs(songs));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Album)

//connect(mapStateToProps, mapDispatchToProps)(LoginPage);
//mapStateToProps当你返回一个对象后，会把返回的对象映射到组件的props中,不需要的时候传入null

// mapDispatchToProps作用和mapStateToProps相似，但是功能不太一样。
// 它返回对象里的值也会映射到props中，但是mapDispatchToProps的作用是方便我们做dipatch的绑定。
// 比如我们点击登录按钮要触发登录的Action, 我们就得执行dispatch(loginIn)，而mapDispatchToProps会帮我们将这个函数映射到props中，这样在组件中我们只需要通过以下方式就可以实现Action的发送，其作用主要还是将我们组件中Action操作进行统一管理。
// <TouchableOpacity onPress={this.props.onClickLoginButton}>
//       <Text style={styles.loginText}>登 录</Text>
// </TouchableOpacity>

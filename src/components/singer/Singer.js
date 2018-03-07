import React from "react"
import {CSSTransition} from "react-transition-group"
import Header from "@/common/header/Header"
import Loading from "@/common/loading/Loading"
import Scroll from "@/common/scroll/Scroll"
import {getSingerInfo} from "@/api/singer"
import {getSongVKey} from "@/api/song"
import {CODE_SUCCESS} from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as SongModel from "@/model/song"

import './singer.styl'


class Singer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: true,
            singer: {},
            songs: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        this.setState({
            show: true
        });

        getSingerInfo(this.props.match.params.id).then(res => {
             console.log("获取歌手详情：");
             if (res) {
                 console.log(res)
                 if (res.code === CODE_SUCCESS) {

                 }
             }
        })
    }


    render () {
        return (
           <CSSTransition classNames="translate" timeout={300} in={this.state.show}>
                <div className="music-singer">
                     <Header  ref="header"/>
                    12312
                </div>
           </CSSTransition>
        )
    }
}

export default Singer 
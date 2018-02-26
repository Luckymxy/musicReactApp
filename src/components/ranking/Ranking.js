import React from "react"
import {Route} from "react-router-dom"
import RankingInfo from "@/containers/Ranking"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import LazyLoad, {forceCheck} from "react-lazyload"
import {getRankingList} from "@/api/ranking"
import {CODE_SUCCESS} from "@/api/config"
import * as RankingModel from "@/model/ranking"

import "./ranking.styl"


class Ranking extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            refreshScroll: false,
            load: true,
            rankingList: []
        };
    }
    componentDidMount() {
        getRankingList().then((res)=>{
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    let topList = [];
                    res.data.topList.forEach(function(item) {
                         if (/MV/i.test(item.topTitle)) return;
                         topList.push(RankingModel.createRankingByList(item))
                    });
                    this.setState({
                        load: false,
                        rankingList: topList
                    },()=>{
                        this.setState({
                            //render结构改变刷新scroll
                            refreshScroll: true
                        })
                    })
                }
            }
        })
    }

    toRankingInfo(url) {
        return () => {
            this.props.history.push({
                pathname: url
            });
        }
    }

    render() {
        let {match} = this.props;
        return (
            <div className="music-ranking">
                <Scroll refresh={this.state.refreshScroll}
                onScroll={() => {forceCheck();}}>
                    <div className="ranking-list">
                        {
                            this.state.rankingList.map(item => {
                                return (
                                    <div className="ranking-wrapper" key={item.id} onClick={this.toRankingInfo(`${match.url}/${item.id}`)}>
                                        <div className="left">
                                            <LazyLoad>
                                                <img src={item.img} alt={item.title}/>
                                            </LazyLoad>
                                        </div>
                                        <div className="right">
                                            <h1 className="ranking-title">
                                                {item.title}
                                            </h1>
                                            { 
                                                item.songs.map((song, index) => (
                                                    <div className="top-song" key={index}>
                                                        <span className="index">{index + 1}</span>
                                                        <span>{song.name}</span>
                                                        &nbsp; - &nbsp;
                                                        <span className="song">{song.singer}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Scroll>
                <Loading title="正在加载" show={this.state.loading}/>
                <Route path={`${match.url + '/:id'}`} component={RankingInfo} />
            </div>
        );
    }
}

export default Ranking
import React from 'react'
import ReactDOM from 'react-dom'
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import {getSingerList} from "@/api/singer"
import {CODE_SUCCESS} from "@/api/config"
import * as SingerModel from "@/model/singer"

import './singerlist.styl'

class SingerList extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props);
		this.types = [
			{key:"all_all", name:"全部"},
			{key:"cn_man", name:"华语男"},
			{key:"cn_woman", name:"华语女"},
			{key:"cn_team", name:"华语组合"},
			{key:"k_man", name:"韩国男"},
			{key:"k_woman", name:"韩国女"},
			{key:"k_team", name:"韩国组合"},
			{key:"j_man", name:"日本男"},
			{key:"j_woman", name:"日本女"},
			{key:"j_team", name:"日本组合"},
			{key:"eu_man", name:"欧美男"},
			{key:"eu_woman", name:"欧美女"},
			{key:"eu_team", name:"欧美组合"},
			{key:"other_other", name:"其它"}
		];
		this.indexs = [
			{key:"all", name:"热门"},
			{key:"A", name:"A"},
			{key:"B", name:"B"},
			{key:"C", name:"C"},
			{key:"D", name:"D"},
			{key:"E", name:"E"},
			{key:"F", name:"F"},
			{key:"G", name:"G"},
			{key:"H", name:"H"},
			{key:"I", name:"I"},
			{key:"J", name:"J"},
			{key:"K", name:"K"},
			{key:"L", name:"L"},
			{key:"M", name:"M"},
			{key:"N", name:"N"},
			{key:"O", name:"O"},
			{key:"P", name:"P"},
			{key:"Q", name:"Q"},
			{key:"R", name:"R"},
			{key:"S", name:"S"},
			{key:"T", name:"T"},
			{key:"U", name:"U"},
			{key:"V", name:"V"},
			{key:"W", name:"W"},
			{key:"X", name:"X"},
			{key:"Y", name:"Y"},
			{key:"Z", name:"Z"}
		];

		this.state = {
			loading: true,
			typeKey: "all_all",
			indexKey: "all",
			singers: [],
			refreshScroll: false
		}
    }
    componentDidMount() {
        //console.log(this.props);
		this.initNavScrollWidth();
		this.getSingers();
    }

	initNavScrollWidth() {
		//console.log(this.props);
		let tagDOM = ReactDOM.findDOMNode(this.refs.tag);
		let tagA = tagDOM.querySelectorAll('a');
		let tagTotalWidth = 0;
		let indexDOM = ReactDOM.findDOMNode(this.refs.index);
		let indexA = indexDOM.querySelectorAll('a');
		let indexTotalWidth = 0;
		[].forEach.call(tagA, ele => {
			tagTotalWidth += ele.offsetWidth;
		})
		// [].forEach.apply(tagA, [ele => {
		// 	tagTotalWidth += ele.offsetWidth;
		// }])
		Array.from(indexA).forEach(ele => {
			indexTotalWidth += ele.offsetWidth;
		})
		tagDOM.style.width = tagTotalWidth + "px";
		indexDOM.style.width = indexTotalWidth + "px";
	}

	getSingers() {
		getSingerList(1,`${this.state.typeKey + '_' + this.state.indexKey}`).then(res => {
			console.log('获取歌手列表');
			console.log(res)
			if (res) {
				console.log(res)
				if (res.code === CODE_SUCCESS) {
					let singers = [];

				}
			}
		})
	}

    render() {
		let tags = this.types.map(item => (
			<a key={item.key} className={this.state.typeKey === item.key ? "choose" : ""}>
				{item.name}
			</a>
		));

		let indexs = this.indexs.map(item => (
			<a key={item.key} className={this.state.indexKey === item.key ? "choose" : ""}>
				{item.name}
			</a>
		));
	
        return (
            <div className="music-singers">
				<div className="nav">
					<Scroll direction="horizontal">
						<div className="tag" ref="tag">
							{tags}
						</div>
					</Scroll>	
					<Scroll direction="horizontal">
						<div className="index" ref="index">
							{indexs}
						</div>
					</Scroll>
				</div>
			</div>
        )
    }
}

export default SingerList
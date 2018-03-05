import jsonp from "./jsonp"
import {URL, PARAM, OPTION} from "./config"

export function getSingerList(pagenum, key) {
    const data = Object.assign({}, PARAM, {
        g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		channel: "singer",
		page: "list",
		key,
		pagenum,
		pagesize: 100
    })  //channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=5381&jsonpCallback=GetSingerListCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0

    return jsonp(URL.singerList, data, OPTION);
}

export function getSingerInfo(mId) {
    const data = Object.assign({}, PARAM, {
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		singermid: mId,
		order: "listen",
		begin: 0,
		num: 100,
		songstatus: 1
	});
    return jsonp(URL.singerInfo, data, OPTION);
}
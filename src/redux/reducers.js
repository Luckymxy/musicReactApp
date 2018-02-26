/**
 * reducers.js存放用来更新当前播放歌曲，播放歌曲列表和显示或隐藏播放页状态的纯函数。一定要保证reducer函数的纯净，
 * 永远不要有以下操作
    修改传入参数
    执行有副作用的操作，如 API 请求和路由跳转
    调用非纯函数，如 Date.now() 或 Math.random()
 */
import { combineReducers } from 'redux'
import * as ActionTypes from "./actionTypes"
import localStorage from "@/util/storage";         //持久化数据到本地，读取localStorage中的当前播放歌曲以及歌曲列表

/**
 * reducer就是一个纯函数，接收旧的state和action，返回新的state
 */

//需要存储的初始状态数据
const initialState = {
        showStatus: false,  //显示状态
        song: localStorage.getCurrentSong(),  //当前歌曲    ，       初始化读取localStorage数据
        songs: localStorage.getSongs()  //歌曲列表
    };

//拆分Reducer
//显示或隐藏播放状态
function showStatus(showStatus = initialState.showStatus, action) {
    switch (action.type) {
        case ActionTypes.SHOW_PLAYER:
            return action.showStatus;
        default:
            return showStatus;
    }
}

//修改当前歌曲
function song(song = initialState.song, action) {
    switch (action.type) {
        case ActionTypes.CHANGE_SONG:
            localStorage.setCurrentSong(action.song);    //当前播放歌曲存储在localStorage
            return action.song;
        default:
            return song;
    }
}
//添加或移除歌曲
function songs(songs = initialState.songs, action) {
    switch (action.type) {
        case ActionTypes.SET_SONGS:
            localStorage.setSongs(action.songs);   ////当前歌曲列表存储在localStorage
            return action.songs;
        case ActionTypes.REMOVE_SONG_FROM_LIST:
            localStorage.setSongs(action.songs);
            return songs.filter(song => song.id !== action.id);
        default:
            return songs;
    }
}
//合并Reducer 
const reducer = combineReducers({
    showStatus,
    song,  
    songs 
}); 

export default reducer





// var combineReducers1 = function(obj){
//     //内部具体代码

//     var finalState = {};
//     function reducer(state,action){
//         //reducer具体逻辑

//         for (var p in obj) {
//          //根据key属性值调用function(state.属性名，action)
//          finalState[p] = obj[p](state[p], action);
//         }

//         //返回state
//         return finalState;
//     }

//     //返回最终的reducer
//     return reducer;
// }
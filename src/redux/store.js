import {createStore} from "redux"
import reducer from "./reducers"

 //创建store
const store = createStore(reducer);
console.log(store)
export default store


// export default createStore(reducer, initialState) {
//     //闭包私有变量
//     let currentState = initialState
//     let currentReducer = reducer
//     let listeners = []

//     //返回一个包含可访问闭包变量的公有方法
//     return {
//         getState() {
//             return currentState //返回当前 state
//         },
//         subscribe(listener) {
//             let index = listeners.length
//             listeners.push(listener) //缓存 listener
//             return () => listeners.splice(i, 1) //返回删除该 listener 的函数
//         },
//         dispatch(action) {
//             //更新 currentState                                                   dispatch便是更新了state
//             currentState = currentReducer(currentState, action)
//             // 可以看到这里并没有用到eventEmitter等
//             listeners.slice().forEach(listener => listener())
//             return action //返回 action 对象
//         }
//     }
// }
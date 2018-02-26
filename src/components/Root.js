import React from "react";
import {Provider} from "react-redux";
import store from "../redux/store";
import App from "./App"

//react-redux提供了Provider组件和connect方法

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}

export default Root;
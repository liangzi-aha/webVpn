import React from 'react';

/**
 * BrowserRouter:h5新特新 / history.push  如果上线之后，需要后台做一些处理：重定向处理 404bug
 */
// import { BrowserRouter  as Router, Route, Switch } from "react-router-dom";

/**
 * HashRouter:锚点链接的形式
 */
import { BrowserRouter as Router,Switch } from "react-router-dom";

/**
 * /mine/ucenter  包含了 mine 组件、ucenter组件
 * 所以两个都会显示
 * 解决办法：exact={true} 精确匹配
 * 
 * exact：精确匹配
 * 
 * strict:严格模式 如果为true，则pathname在确定位置是否与当前URL匹配时，将考虑位置的尾部斜杠
 */

import router from './router/router';
import RoutingGuard from './router/RoutingGuard';

function App() {
  return (
    <div className="App">
      {/* react-router-dom */}
      {/* Router 包裹所有路由 */}
      <Router>
        {/* <Nav /> */}
        {/* Switch：渲染第一个被location匹配到的并且作为子元素的<Route>或者<Redirect>
        使用<Switch>包裹和直接用一打<Route>s有什么区别呢？
        <Switch>是唯一的因为它仅仅只会渲染一个路径。相比之下（不使用<Switch>包裹的情况下），每一个被location匹配到的<Route>将都会被渲染 */}
        <Switch>

          <RoutingGuard routerConfig={router} />
          {/* <Route exact path="/" component={login}></Route>
          <Route component={NotFound}></Route> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;

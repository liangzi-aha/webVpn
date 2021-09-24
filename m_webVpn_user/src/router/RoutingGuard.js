import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getCookie } from '../utils/common.js'

class FrontendAuth extends Component {
  render() {
    const { routerConfig, location } = this.props;
    console.log(this.props)

    const { pathname } = location;
    console.log( pathname.split('/')[1])

    // 登录成功状态
    const isLogin = getCookie("flwebvpn_user_sessionid");
    
    // 检索当前 pathname 是否包含，router.js 路面的某个路由
    const targetRouterConfig = routerConfig.find(
      (item) => {
        // 这里为什么使用('/' + pathname.split('/')[1])检索路由，这一步是为了方便使用子路由,这样检索等于只检索一级路由，二级路由不检索
        // 例如：/home/user 这里也会返回 home 组件，如果不想让 /home/user 路由展示home 组件，使其变成非法路由，就像在home组件添加 <Redirect from="/home/*" to="/404"></Redirect>，再或者可以在router.js 里面添加一个是否有子组件的状态，一级路由检索出来之后，判断该路由对象的子组件的状态 是否为true，如果为true返回路由对象，否则返回 false
        return '/' + pathname.split('/')[1] === item.path.replace(/\s*/g,"")
      }
    );
    
    if (isLogin) {
      // 如果是登陆状态，想要跳转到登陆，重定向到主页
      if (pathname === "/login" || pathname === '/') {
        return <Redirect to="/home" />;
      } else {
        // 如果路由合法，就跳转到相应的路由
        if (targetRouterConfig) {
          return (<Route path={pathname} exact={true} component={targetRouterConfig.component} />);
        } else {
          // 如果路由不合法，重定向到 404 页面
          return <Redirect to="/404" />;
        }
      }
    } else {
      // 没有登录
      if(pathname === '/'){  // 没有登录,默认 / 路由跳转 /login 页面
        return <Redirect to="/login" />;
      } else if (targetRouterConfig && !targetRouterConfig.auth) {  // 合法路由 and （auth：false）该路由不需要登录
        const { component } = targetRouterConfig;
        return <Route exact path={pathname} component={component} />
      } else if (targetRouterConfig && targetRouterConfig.auth) {  // 合法路由 and （auth：true）该路由需要登录
        return <Redirect to="/login" />;
      } else {
        // 非登陆状态下，路由不合法时，重定向至 404
        return <Redirect to="/404" />;
      }
    }
  }
}
export default FrontendAuth
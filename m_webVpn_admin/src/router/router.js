import Home from '../page/home/home';
import Login from '../page/login/login.jsx';
import NotFound from '../page/NotFound/NotFound.jsx';

var routes = [
    { path: "/home", name: "home", component: Home, auth: true },
    { path: "/login", name: "login", component: Login, auth: false },
    { path: "/404", name: "NotFound", component: NotFound, auth: true },
]
// auth 是否需要登录
export default routes;
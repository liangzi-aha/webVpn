import React from "react";
import { Drawer, NavBar, Toast } from 'antd-mobile';
import './home.less';
import userManagement from '../../components/userManagement/userManagement.jsx';
import Theme from '../../components/theme/theme.jsx';
import roleManagement from '../../components/roleManagement/roleManagement.jsx';
import resourceAdministration from '../../components/resourceAdministration/resourceAdministration.jsx';
import { Route,Redirect,Switch } from "react-router-dom";
import { Button, WingBlank } from 'antd-mobile';
import { delCookie } from "../../utils/common";
import fetch from '../../fetch/fetch';

export default class home extends React.Component {
    state = {
        docked: false,
        title: 'webVpn'
    }
    onDock = (d) => {
        this.setState({
            [d]: !this.state[d],
        });
    }

    // 导航切换
    NavSelect = (routerPath, index) => {
        // 动画
        this.refs.path.style.top = (document.getElementsByClassName('c-sidebar__link')[0].offsetHeight * index) + 'px';
        // 路由
        this.props.history.push(routerPath);

        setTimeout(() => {
            this.setState({
                docked: false
            })
            // 修改title
            if (this.props.location.pathname === '/home') {
                this.setState({
                    title: '主题'
                })
            } else if (this.props.location.pathname === '/home/userManagement') {
                this.setState({
                    title: '用户管理'
                })
            } else if (this.props.location.pathname === '/home/role') {
                this.setState({
                    title: '角色管理'
                })
            } else if (this.props.location.pathname === '/home/resouce') {
                this.setState({
                    title: '资源管理'
                })
            }
        }, 300);
    }

    componentDidMount() {

        if (this.props.location.pathname === '/home') {
            this.refs.path.style.top = (document.getElementsByClassName('c-sidebar__link')[0].offsetHeight * 0) + 'px';
            this.setState({
                title: '主题'
            })
        } else if (this.props.location.pathname === '/home/userManagement') {
            this.refs.path.style.top = (document.getElementsByClassName('c-sidebar__link')[0].offsetHeight * 1) + 'px';
            this.setState({
                title: '用户管理'
            })
        } else if (this.props.location.pathname === '/home/role') {
            this.refs.path.style.top = (document.getElementsByClassName('c-sidebar__link')[0].offsetHeight * 2) + 'px';
            this.setState({
                title: '角色管理'
            })
        } else if (this.props.location.pathname === '/home/resouce') {
            this.refs.path.style.top = (document.getElementsByClassName('c-sidebar__link')[0].offsetHeight * 3) + 'px';
            this.setState({
                title: '资源管理'
            })
        }

        let box = document.getElementsByClassName('App')[0] // 监听对象
        let startTime = '' // 触摸开始时间
        let startDistanceX = '' // 触摸开始X轴位置
        let startDistanceY = '' // 触摸开始Y轴位置
        let endTime = '' // 触摸结束时间
        let endDistanceX = '' // 触摸结束X轴位置
        let endDistanceY = '' // 触摸结束Y轴位置
        let moveTime = '' // 触摸时间
        let moveDistanceX = '' // 触摸移动X轴距离
        let moveDistanceY = '' // 触摸移动Y轴距离
        box.addEventListener("touchstart", (e) => {
            // e.preventDefault();

            startTime = new Date().getTime()
            startDistanceX = e.touches[0].screenX
            startDistanceY = e.touches[0].screenY
        },{ passive: false })
        box.addEventListener("touchend", (e) => {
            // e.preventDefault();

            endTime = new Date().getTime()
            endDistanceX = e.changedTouches[0].screenX
            endDistanceY = e.changedTouches[0].screenY
            moveTime = endTime - startTime
            moveDistanceX = startDistanceX - endDistanceX
            moveDistanceY = startDistanceY - endDistanceY
            console.log(moveDistanceX, moveDistanceY)
            // 判断滑动距离超过40 且 时间小于500毫秒
            if ((Math.abs(moveDistanceX) > 40 || Math.abs(moveDistanceY) > 40) && moveTime < 500) {
                // 判断X轴移动的距离是否大于Y轴移动的距离
                if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
                    // 左右
                    if(moveDistanceX > 0){
                        this.setState({
                            docked: false
                        })
                    } else{
                        this.setState({
                            docked: true
                        })
                    }
                    console.log(moveDistanceX > 0 ? '左' : '右')
                } else {
                    // 上下
                    console.log(moveDistanceY > 0 ? '上' : '下')
                }
            }
        },{ passive: false })
    }

    // 退出登录
    logOut = ()=>{
        fetch.admniOut({}).then(res=>{
            if(res.success){
                delCookie('flwebvpn_admin_sessionid','.fengnever.icu');
                Toast.success('退出成功');
                this.props.history.push('/login');
            }
        })
        
    }


    render() {
        const sidebar = (<div className="navContent">
            <p className="web-font logo">webVpn</p>
            <span className="c-sidebar__title">
                管理员操作
            </span>
            <ul>
                <li className={this.props.location.pathname === '/home' ? 'c-sidebar__link activeNav' : 'c-sidebar__link'} onClick={
                    this.NavSelect.bind(this, '/home', 0)
                }>
                    <i className="iconfont">&#xe91d;</i>
                    <span>主题</span>
                </li>
                <li className={this.props.location.pathname === '/home/userManagement' ? 'c-sidebar__link activeNav' : 'c-sidebar__link'} onClick={
                    this.NavSelect.bind(this, '/home/userManagement', 1)
                }>
                    <i className="iconfont">&#xe610;</i>
                    <span>用户管理</span>
                </li>
                <li className={this.props.location.pathname === '/home/role' ? 'c-sidebar__link activeNav' : 'c-sidebar__link'} onClick={
                    this.NavSelect.bind(this, '/home/role', 2)
                }>
                    <i className="iconfont">&#xe72c;</i>
                    <span>角色管理</span>
                </li>
                <li className={this.props.location.pathname === '/home/resouce' ? 'c-sidebar__link activeNav' : 'c-sidebar__link'} onClick={
                    this.NavSelect.bind(this, '/home/resouce', 3)
                }>
                    <i className="iconfont">&#xe60a;</i>
                    <span>资源管理</span>
                </li>
                <span ref="path"></span>
            </ul>
            <WingBlank style={{ position: 'absolute',left: '0',right:'0',bottom: '50px' }}>
                <Button size="large" onClick={ this.logOut }>退出登录</Button>
            </WingBlank>
        </div>);

        return (
            <div className="home" style={{ height: '100%' }}>
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                    sidebarStyle={{ border: '1px solid #ddd' }}
                    sidebar={sidebar}
                    docked={this.state.docked}
                    touch={true}
                    dragToggleDistance={30}
                >
                    <NavBar
                        mode="light"
                        icon={
                            <i className="iconfont">&#xeaff;</i>
                        }
                        onLeftClick={() => this.onDock('docked')}
                        rightContent={[]}
                    >
                        <p className="web-font NavTitle">{this.state.title}</p>
                    </NavBar>
                    {/* 子路由 */}
                    <Switch>
                        <Route path='/home' exact component={Theme}></Route>
                        <Route path='/home/userManagement' exact component={userManagement}></Route>
                        <Route path='/home/role' exact component={roleManagement}></Route>
                        <Route path='/home/resouce' exact component={resourceAdministration}></Route>
                        {/* /home/*: /home下的子路由路由不合法时跳转404页面 */}
                        <Redirect from="/home/*" to="/404"></Redirect>
                    </Switch>
                </Drawer>
            </div>
        )
    }
}
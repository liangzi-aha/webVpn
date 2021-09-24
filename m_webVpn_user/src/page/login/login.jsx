import React from 'react';
import { Button,Toast } from 'antd-mobile';
import { List, InputItem } from 'antd-mobile';
import './login.less';
import fetch from '../../fetch/fetch';
import { $md5 } from '../../utils/common';
import bacImg from '../../static/img/loding3.jpg';
import { setCookie } from '../../utils/common';

export default class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
        }
    }

    // 登录接口
    login = () => {
        fetch.login({
            user_number: this.state.account,
            user_pwd_md5: $md5(this.state.password)
        }).then(res => {
            if(res.success){
                Toast.success(res.message,1);
                setCookie('user_id',res.data.user_id);
                this.props.history.push('/home');
            }
        })
    }

    render() {
        return (
            <div className="login_box">
                <img className="loginBac" src={bacImg} alt="" />
                <div className="login">
                    <div className="web-font loginLogo">webVpn</div>
                    <List>
                        <InputItem
                            placeholder="请输入用户账号"
                            clear="true"
                            maxLength="8"
                            onChange={(value) => {
                                this.setState({
                                    account: value
                                })
                            }}
                        >
                            <i className="iconfont">&#xe787;</i>
                        </InputItem>
                        <InputItem
                            placeholder="请输入用户密码"
                            clear="true"
                            type="password"
                            onChange={(value) => {
                                this.setState({
                                    password: value
                                })
                            }}
                        >
                            <i className="iconfont">&#xe62a;</i>
                        </InputItem>
                    </List>

                    <Button type="primary" onClick={this.login}>登录</Button>
                </div>
            </div>
        )
    }

}
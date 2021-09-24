import { HttpPost } from './api';

export default {
    // 管理员退出登录
    admniOut(params){
        return HttpPost('/flwebvpn_admin/logout',params)
    },
    // 管理员登录接口
    adminLogin(params){
        return HttpPost('/flwebvpn_admin/login',params)
    },
    // 用户列表
    userList(params){
        return HttpPost('/flwebvpn_admin/show_all_user',params);
    },
    // 用户添加
    userAdd(params){
        return HttpPost('/flwebvpn_admin/add_user',params)
    },
    // 用户编辑
    userEdit(params){
        return HttpPost('/flwebvpn_admin/mod_user',params)
    },
    // 用户删除
    userDelete(params){
        return HttpPost('/flwebvpn_admin/del_user',params)
    },
    // 用户绑定角色
    bindRole(params){
        return HttpPost('/flwebvpn_admin/set_user_bind_role',params)
    },
    // 查询角色绑定用户
    roleBindUser(params){
        return HttpPost('/flwebvpn_admin/role_bind_user',params)
    },
    // 角色列表
    roleList(params){
        return HttpPost('/flwebvpn_admin/show_all_role',params);
    },
    // 添加角色
    addRole(params){
        return HttpPost('/flwebvpn_admin/add_role',params)
    },
     // 编辑角色
     modRole(params){
        return HttpPost('/flwebvpn_admin/mod_role',params)
    },
    // 删除角色 
    delRole(params){
        return HttpPost('/flwebvpn_admin/del_role',params)
    },
    // 绑定资源 
    bindRes(params){
        return HttpPost('/flwebvpn_admin/set_role_bind_res',params)
    },
    // 资源列表
    ResList(params){
        return HttpPost('/flwebvpn_admin/show_all_resource',params)
    },
    // 编辑资源  
    modResource(params){
        return HttpPost('/flwebvpn_admin/mod_resource',params)
    },
    // 添加资源  
    addResource(params){
        return HttpPost('/flwebvpn_admin/add_resource',params)
    },
    // 删除资源  
    delResource(params){
        return HttpPost('/flwebvpn_admin/del_resource',params)
    }
}
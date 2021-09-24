// 设置cookie
export function setCookie(c_name, value, expiredays) {
    if (expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ";expires = " + exdate.toGMTString() + ";path = /;";
    } else {
        document.cookie = c_name + "=" + escape(value) + ";path = /;";
    }
}

// 获取cookie
export function getCookie(name) {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg);
    if (document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return '';
    }
}
// 删除cookie
export function delCookie(name, domain, value = '') {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() - 1);
    if (name != null && domain) {
        document.cookie = name + "=" + escape(value) + ";expires = " + exdate.toGMTString() + ";path = /;domain=" + domain;
    } else {
        document.cookie = name + "=" + escape(value) + ";expires = " + exdate.toGMTString() + ";path = /;";
    }
}
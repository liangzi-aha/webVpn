<template>
    <div class="Loding">
        <img :src="Wallpaper3" alt="">
    </div>
</template>

<script>
import Wallpaper3 from '../../public/static/img/loding3.jpg';
import { ElLoading } from 'element-plus';

export default {
    name:'Loding',
    data(){
        return{
            Wallpaper3,
        }
    },
    mounted(){
        var loading;
        // 加载动画
        loading = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })

        setTimeout(()=>{
            loading.close();
            if(this.$getCookie('flwebvpn_admin_sessionid')){
                this.$router.push('/admin');
            }else{
                this.$router.push('/login');
            }
        },2000)
    }
}
</script>

<style scoped lang="scss">
.Loding{
    width: 100%;
    height: 100%;
    img{
        width: 100%;
        height: 100%;
        object-fit:cover;
    }
}
</style>
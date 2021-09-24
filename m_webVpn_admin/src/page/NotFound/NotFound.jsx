import React from 'react';
import notFound from '../../static/gif/404.gif'

const style ={
    width: '100%',
    height: '100%',
    objectFit: 'cover'
}

const NotFound = (props)=>{
    return(
        <img src={notFound} alt="404" style={ style } onClick={ ()=>{ props.history.push('/home') } }/>
    )
}

export default NotFound;
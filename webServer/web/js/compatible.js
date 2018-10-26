/**
 * 用来解决一些兼容方面的问题或者干一些与数据无关的脏活
 */
/**
 * 滚动的监听事件，用来隐藏用户信息面板
 * @param {event} e event
 */
function c_scroll(e) {
    window.removeEventListener('scroll', c_scroll)
    const element = document.querySelector('.showUser')
    element.style.display = "none"
}
/**
 * 用于显示展示用户信息的面板
 */
function c_showUser(event) {
    window.addEventListener('scroll',c_scroll)
    const location=event.target.getBoundingClientRect()
    const element=document.querySelector('.showUser')
    element.style.display="inline"
    element.style.left=location.x+42+'px'
    element.style.top=location.y+42+'px'
}


post({},"getLoginUser" , (res) => {
    console.table(res)
})
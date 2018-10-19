/**
 * 用来解决一些兼容方面的问题或者干一些与数据无关的脏活
 */
/**
 * 滚动的监听事件
 * @param {event} e event
 */
function scroll(e) {
    window.removeEventListener('scroll', scroll)
    const element = document.querySelector('.showUser')
    element.style.display = "none"
}


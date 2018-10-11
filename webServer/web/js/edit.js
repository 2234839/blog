/**
 * 用来操纵wangEditor
 */
window.onload=function(){
    var E = window.wangEditor
    edit1=document.createElement('div')//编辑
    edit2=document.createElement('div')//修改
    //之所以添加又移除是因为这个编辑器必须在dom上才能创建
    document.body.appendChild(edit1)
    document.body.appendChild(edit2)
    editor1 = new E(edit1)
    editor2 = new E(edit2)
    editor1.customConfig.uploadImgServer = '/file'
    editor2.customConfig.uploadImgServer = '/file'
    editor1.create()
    editor2.create()
    edit1.style.backgroundColor='antiquewhite'
    edit2.style.backgroundColor='antiquewhite'
    edit1.remove()
    edit2.remove()
}
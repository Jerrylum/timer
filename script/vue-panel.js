"use strict";var vuePanel=new Vue({el:"#setting-panel",mounted:function(){var e=getCookie();this.theme=e.theme||this.theme},data:{isHideOptional:!1,theme:"dark",themesList:["dark","light"]},watch:{isHideOptional:function(){document.body.style.cursor=this.isHideOptional?"none":""},theme:{handler:function(){document.body.className=this.theme,setCookie({theme:this.theme})},immediate:!0}}});
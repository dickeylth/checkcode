/*! checkcode - v1.0 - 2013-07-17 1:59:54 PM
* Copyright (c) 2013 hongshu; Licensed  */
KISSY.add("gallery/checkcode/1.0/index",function(a,b,c){function d(a){var b=this;d.superclass.constructor.call(b,a),b.init(a)}return a.extend(d,a.Base,{init:function(){var a=this;a.initEnv(),a.bindUI(),a.render()},initEnv:function(){var b=this;if(b._host=location.hostname.indexOf("daily.taobao.net")>0?"daily.taobao.net":"taobao.com",!ua||""==ua)throw"UA must be existing, please check and retry!";b.get("form").all("input").each(function(b){b.attr("placeholder")&&new c({node:b}),b.attr("name")||b.hasClass("J_CK_INP")||a.log(b.outerHTML()+" doesn't has name attribute, make sure it won't matter form submit.")})},render:function(){var a=this;a.get("ckInpNode").val(""),a.updateImg(),a.hideWaiting()},fetchCheckcode:function(c){var d=this,e={url:d.get("fetchUrl")+"?&t="+a.now(),dataType:"jsonp",success:function(a){var b=a.code;if(200==a.code){var e=a.data;d._url=e.checkUrl,d._cst=e.cst,d._csk=e.csk,c(b)}}};b(e)},updateImg:function(){var a=this;a.fetchCheckcode(function(){var b=a.get("ckImgNode");b.attr("src",a._url+"&t="+(new Date).getTime())})},clearCheckcode:function(){var a=this;a.get("ckLoadingNode").css("display","none"),a.clearErr(),a.updateImg()},submitFn:function(a){var c=this,d=c.get("validateForm");if(d(c)){var e=c.get("validateUrl");new b({type:"get",url:e+"?"+a,form:c.form,success:function(a){c.fire("subSuccess",a)},error:function(){c.fire("subError")},dataType:"jsonp",timeout:15})}},bindUI:function(){var b=this,c=b.get("form"),d=b.get("ckImgNode"),e=b.get("ckInpNode"),f=b.get("ckErrorNode");c.on("submit",function(c){if(c.halt(),e.val().length<4)return f.css("display","block").html("\u4eb2\uff0c\u8bf7\u5148\u8f93\u5165\u9a8c\u8bc1\u7801\u54e6\uff01"),void 0;b.showWaiting();var d="checkcode="+e.val()+"&csk="+b._csk+"&cst="+b._cst+"&ua="+b.flushUA()+"&t="+a.now();b.clearErr(),b.submitFn(d)}),d.on("click",function(){b.updateImg()}),e.on("focus",function(){b.setErr("")})},clearErr:function(){var a=this;return a.get("ckErrorNode").html("").hide(),a},setErr:function(a){if(a){var b=this;b.hideWaiting(),b.get("ckErrorNode").html(a).show()}return b},flushUA:function(){var a=encodeURIComponent(ua);return UA_Opt.Token=(new Date).getTime()+":"+Math.random(),UA_Opt&&UA_Opt.reload(),a},showWaiting:function(){var a=this,b=a.get("ckLoadingNode");return b.show(),a},hideWaiting:function(){var a=this,b=a.get("ckLoadingNode");return b.hide(),a},_validateNode:function(b,c){var d=this.get("form"),e=a.isString(c)?d.one(c):c;if(a.isNull(e))throw b+" node is undefined or null, please check and retry!";return e},_getNode:function(a){return this.get("form").one(a)}},{ATTRS:{form:{value:"",setter:function(b){var c=a.one,d=a.isString(b)?c(b):b;if(a.isNull(d))throw"Form is undefined or null, please check and retry!";return d}},ckImgNode:{valueFn:function(){return this._getNode(".J_CK_IMG")},setter:function(a){return this._validateNode("Checkcode image",a)}},ckInpNode:{valueFn:function(){return this._getNode(".J_CK_INP")},setter:function(a){return this._validateNode("Checkcode input",a)}},ckLoadingNode:{valueFn:function(){return this._getNode(".J_CK_LOADING")},setter:function(a){return this._validateNode("Checkcode loading/waiting",a)}},ckErrorNode:{valueFn:function(){return this._getNode(".J_CK_ERROR")},setter:function(a){return this._validateNode("Checkcode error",a)}},fetchUrl:{valueFn:function(){return"http://promotion.trip."+this._host+"/weibo/weibo_check_code_url.htm"}},validateUrl:{valueFn:function(){return"http://promotion.trip."+this._host+"/platform/send_mobile_message704.htm"}},validateForm:{value:function(){return!0},setter:function(b){if(!a.isFunction(b))throw"Validate form method should be a function, please check and retry!"}}}}),d},{requires:["ajax","gallery/placeholder/1.0/"]});
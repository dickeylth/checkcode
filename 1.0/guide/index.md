## 综述

checkcode是基于淘宝旅行业务线的对包含验证码的表单进行封装的组件，提供验证码拉取和表单校验等基础功能。

## 快速使用

### HTML结构

<form>
	<input type="tel" name="phonenum" class="user-phone-num" placeholder="请输入手机号"/>
	<input type="text" class="J_CK_INP" size="4" maxlength="4" placeholder="验证码"/>
	<img class="J_CK_IMG"/>
	[<a class="checkcode-update">看不清换一张</a>]
	<div class="submit-div">
		<div class="submit-loading J_CK_LOADING"></div>
		<button type="submit" class="send-sms-btn">提交</button>
	</div>
	<span class="J_CK_ERROR"></span>
</form>

	<form>
		[<input type="tel" name="phonenum" class="user-phone-num" placeholder="请输入手机号"/>
		<input type="text" name="..." placeholder="..."/>]
		<input type="text" class="J_CK_INP" size="4" maxlength="4" placeholder="验证码"/>
		<img class="J_CK_IMG"/>
		[<a class="checkcode-update">看不清换一张</a>]
		<div class="submit-div">
			<div class="submit-loading J_CK_LOADING"></div>
			<button type="submit" class="send-sms-btn">提交</button>
		</div>
		<span class="J_CK_ERROR"></span>
	</form>

### 基础表单样式

	form{overflow: hidden;position: relative;
	    .submit-div{width: 83px;height: 38px;position: relative;
	        .submit-loading{position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: url("http://img04.taobaocdn.com/tps/i4/T1.DCEXe0oXXXXXXXX-32-32.gif") 50% 50% no-repeat #b3a27f;}
	        .send-sms-btn{width: 100%;height: 100%;border: 0;}
	    }
	    [.checkcode-update{width: 40px;color: #e4d9b7;padding: 0 2px;}]
	    input, div, a, span, img{float: left;margin-right: 2px;}
	}

#### 说明：
+ 输入框各input/select/textarea域如需作为表单提交字段，需加上name属性，组件会调用ajax模块的表单自动序列化功能实现表单参数拼接
+ 组件中已引入placeholder，对表单中指定placeholder域的input输入框可以自动进行增强
+ []部分为可选

### 初始化组件

    S.use('gallery/checkcode/1.0/index', function (S, Checkcode) {
		var checkcode = new CheckCode({
		    form: "#J_CKForm502",//验证码关联的表单，query/NodeList

		    [ckImgNode: '.J_CK_IMG',//指定验证码图片节点，query(context: form)/NodeList
		    ckInpNode: '.J_CK_INP',//指定验证码输入节点，query(context: form)/NodeList
		    ckLoadingNode: '.J_CK_LOADING',//指定表单loading/waiting节点，query(context: form)/NodeList
		    ckErrorNode: '.J_CK_ERROR',//指定显示错误信息节点，query(context: form)/NodeList]

		    [checkUrl: 'http://promotion.trip.taobao.com/weibo/weibo_check_code_url.htm',//获取验证码图片的接口
		    validateUrl: 'http://promotion.trip.taobao.com/platform/send_mobile_message704.htm',//校验验证码及表单的接口]

            validateForm: function(that){
                var phonenum = S.trim(that.get('form').one('.user-phone-num').val());
                if(!(/^0{0,1}(13[0-9]|15[0-3|5-9]|18[0|2|5-9])[0-9]{8}$/).test(phonenum)){
                    that.setErr('手机号格式有误！');
                    //that.clearCheckcode();
                    return false;
                }
                return true;
            }//表单提交前自定义校验方法
	    });
    })

#### 说明：
+ []部分为可选，提供的默认值如上所示。

## API说明

<table>
	<thead>
		<tr>
		      <td>参数名</td>
		      <td>类型</td>
		      <td>默认值</td>
		      <td>描述</td>
		</tr>
	</thead>
	<tbody>
		<tr>
      			<td>form</td>
		      <td>query/NodeList</td>
		      <td>''</td>
		      <td>验证码关联表单节点</td>
		</tr>
		<tr>
		      <td>ckImgNode</td>
		      <td>query/NodeList</td>
		      <td>'.J_CK_IMG'</td>
		      <td>验证码图片节点，以form为上下文寻找</td>
		</tr>
		<tr>
			<td>ckInpNode</td>
			<td>query/NodeList</td>
			<td>'.J_CK_INP'</td>
			<td>验证码输入节点，以form为上下文寻找</td>
		</tr>
		<tr>
			<td>ckLoadingNode</td>
			<td>query/NodeList</td>
			<td>'.J_CK_LOADING'</td>
			<td>表单提交时loading/waiting动画节点</td>
		</tr>
		<tr>
			<td>ckErrorNode</td>
			<td>query/NodeList</td>
			<td>'.J_CK_ERROR'</td>
			<td>表单提交错误信息提示节点</td>
		</tr>
		<tr>
			<td>fetchUrl</td>
			<td>String</td>
			<td>'http://promotion.trip.' + this._host + '/weibo/weibo_check_code_url.htm'</td>
			<td>验证码图片拉取地址</td>
		</tr>
		<tr>
			<td>validataUrl</td>
			<td>String</td>
			<td>'http://promotion.trip.' + this._host + '/platform/send_mobile_message704.htm'</td>
			<td>表单校验地址（包含验证码校验）</td>
		</tr>
		<tr>
			<td>validateForm</td>
			<td>Function</td>
			<td>function () {return true;}</td>
			<td>自定义表单提交前校验方法，返回true才执行表单提交</td>
		</tr>
	</tbody>
</table>

## 组件事件说明

<table>
	<thead>
		<tr>
		      <td>事件名</td>
		      <td>回调参数</td>
		      <td>描述</td>
		</tr>
	</thead>
	<tbody>
		<tr>
      			<td>subSuccess</td>
		      <td>data，后端返回的json数据</td>
		      <td>表单提交成功后触发</td>
		</tr>
		<tr>
		      <td>subError</td>
		      <td>null</td>
		      <td>表单提交失败时触发</td>
		</tr>
	</tbody>
</table>

### 事件例子
	var errorMsg = {
	    "100003" : "验证码错误，请重新输入！",
	    "100006" : "亲，你的验证码已超时，请重新输入哦~",
	    "100008" : "亲，服务器繁忙，请刷新重试哦~",
	    "400011" : "亲，短信发送失败！",
	    "400012" : "亲，手机号码输入有误哦！",
	    "400013" : "亲，同一号码不可以频繁发送哦！",
	    "400014" : "亲，您的手机号码发送次数已达上限！",
	    "400015" : "亲，您的发送次数已达上限！"
	};
	checkcode.on('subSuccess', function(data){
	    S.log(data);
	
	    var that = this;
	    var code = data.code;
	
	    //短信发送成功
	    if(400010 == code){
		    that.setErr(data.msg);
		    //that.clearCheckcode();
	    }else{
		    //验证码错误
		    if (100003 == code) {
			    that.setErr("验证码错误，请重新输入").updateImg();
			    return;
		    }
	
		    that.clearCheckcode();
		    that.setErr(errorMsg[code]);
	    }
	}).on('subError', function(){
	
		var that = this;
	
	    that.setErr(errorMsg[100008]);
	    that.clearCheckcode();
	});

## 组件方法说明
+ clearCheckcode(): 清除错误提示，刷新验证码
+ clearErr(): 清除错误提示
+ setErr(msg): 设置错误消息提示
+ showWaiting(): 显示加载动画
+ hideWaiting(): 隐藏加载动画
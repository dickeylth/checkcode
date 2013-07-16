## 综述

checkcode是基于淘宝旅行业务线的验证码获取和校验组件。

## 快速使用

### 初始化组件

    S.use('gallery/checkcode/1.0/index', function (S, Checkcode) {
		var checkcode = new CheckCode({
		    form: "#J_CKForm502",//验证码关联的表单，query/NodeList
		    (*)ckImgNode: '.J_CK_IMG',//指定验证码图片节点，query(context: form)/NodeList
		    (*)ckInpNode: '.J_CK_INP',//指定验证码输入节点，query(context: form)/NodeList
		    (*)ckLoadingNode: '.J_CK_LOADING',//指定表单loading/waiting节点，query(context: form)/NodeList
		    (*)ckErrorNode: '.J_CK_ERROR',//指定显示错误信息节点，query(context: form)/NodeList
		    checkUrl: 'http://promotion.trip.taobao.com/weibo/weibo_check_code_url.htm',//获取验证码图片的接口
		    validateUrl: 'http://promotion.trip.taobao.com/platform/send_mobile_message704.htm',//校验验证码及表单的接口
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

## 组件方法说明
+ clearCheckcode(): 清除错误提示，刷新验证码
+ clearErr(): 清除错误提示
+ setErr(msg): 设置错误消息提示
+ showWaiting(): 显示加载动画
+ hideWaiting(): 隐藏加载动画
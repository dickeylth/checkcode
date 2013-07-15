/**
 * @fileoverview 
 * @author hongshu<tiehang.lth@taobao.com>
 * @module checkcode
 **/
KISSY.add(function (S, IO, Node, Base, Placeholder) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Checkcode
     * @param config
     * @constructor
     * @extends Base
     */
    function Checkcode(config) {
        var self = this;
        //调用父类构造函数
        Checkcode.superclass.constructor.call(self, config);
        self.init(config);
    }



    S.extend(Checkcode, Base, /** @lends Checkcode.prototype*/{
        init           : function (config) {
            var that = this;

            that.initAttr();
            that.initParam(config || {});

            that.bindUI();
            that.show();
        },
        initParam      : function (config) {
            var that = this;

            that.getCheckcodeUrl = that.get('fetchUrl') || 'http://promotion.trip.' + that._host + '/weibo/weibo_check_code_url.htm';

            var form = that.get('form');

            if(!ua || ua == ''){
                throw('UA must be existing, please check and retry!');
                return;
            }

            //Add placeholder for input fields in the form
            form.all('input').each(function(item){
                if(item.attr('placeholder')){
                    new Placeholder({node: item});
                }
            });
        },
        initAttr       : function () {
            var that = this;
            that._host = location.hostname.indexOf('daily.taobao.net') > 0 ? 'daily.taobao.net' : 'taobao.com';
        },
        fetchCheckcode : function (callback) {
            var that = this;

            var ajaxCfg = {
                url      : that.getCheckcodeUrl + "?&t=" + new Date().getTime(),
                dataType : "jsonp",
                success  : function (data) {
                    var code = data.code;

                    if (data.code == 200) {
                        var tmp = data.data;

                        that._url = tmp.checkUrl;
                        that._cst = tmp.cst;
                        that._csk = tmp.csk;

                        callback(code);
                    }
                }
            };

            IO(ajaxCfg);

        },
        clearCheckcode : function(){
            var that = this;
            that.waiting.css("display", "none");
            that.clearErr();
            that.updateImg();
        },
        submitFn       : function(param){
            var that = this;


            var phonenum = S.trim(that['phoneNum'].val());
            if(!(/^0{0,1}(13[0-9]|15[0-3|5-9]|18[0|2|5-9])[0-9]{8}$/).test(phonenum)){
                that.setErr('手机号格式有误！');
                //that.clearCheckcode();
                return false;
            }

            var url = that.get('validateUrl') || 'http://promotion.trip.' + that._host + '/platform/send_mobile_message704.htm?';
            new IO({
                type     : "get",
                url      : url + "phonenum=" + phonenum + "&" + param,
                form     : that.form,
                success  : function (data) {
                    that.fire('subSuccess', data);
                },
                error    : function () {
                    that.fire('subError');
                },
                dataType : "jsonp",
                timeout  : 15
            });
        },
        bindUI         : function () {
            var that = this;

            that.form.on('submit', function (e) {
                e.halt();

                if (that.codeNode.val().length < 4) {
                    that.errNode.css("display", "block").html('亲，请先输入验证码哦！');
                    return;
                }

                that.showWaiting();
                var param = "checkcode=" + that.codeNode.val() + "&csk=" + that._csk + "&cst=" + that._cst + "&ua=" + that.flushUA() + "&t=" + new Date().getTime();

                that.clearErr();
                that.submitFn(param);

            });

            that.form.one('a.checkcode-update').on('click', function (e) {
                that.updateImg();
            });

            that.img.on('click', function () {
                that.updateImg();
            });

            that.codeNode.on('focus', function () {
                that.setErr("");
            });
        },
        updateImg      : function () {
            var that = this;

            that.fetchCheckcode(function () {
                that.img.attr("src", that._url + "&t=" + new Date().getTime());
            });
        },
        show           : function () {
            var that = this;

            that.codeNode.val("");
            that.updateImg();
            that.hideWaiting();
        },
        clearErr       : function () {
            var that = this;

            that.errNode.html("").hide();

            return that;
        },
        setErr         : function (msg) {

            if(msg){
                var that = this;
                that.hideWaiting();
                that.errNode.html(msg).show();
            }

            return that;
        },
        flushUA        : function () {
            var _ua = encodeURIComponent(ua);

            UA_Opt.Token = new Date().getTime() + ":" + Math.random();
            UA_Opt && UA_Opt.reload();

            return _ua;
        },
        showWaiting    : function () {
            var that = this;

            that.waiting.show();

            return that;
        },
        hideWaiting    : function () {
            var that = this;

            that.waiting.hide();

            return that;
        }
    }, {ATTRS : /** @lends Checkcode*/{
        form: {
            value: '',
            setter: function(val){
                var $ = S.one;
                var form = S.isString(val) ? $(val) : val;
                if(S.isNull(form)){
                    throw('Form is undefined or null, please check and retry!');
                }
                return form;
            }
        },
        ckImgNode: {
            value: '.J_CK_IMG',
            setter: function(val){
                return this._validateNode('Checkcode image', val);
            }
        },
        ckInpNode: {
            value: '.J_CK_INP',
            setter: function(val){
                return this._validateNode('Checkcode input', val);
            }
        },
        ckLoadingNode: {
            value: '.J_CK_LOADING',
            setter: function(val){
                return this._validateNode('Checkcode loading/waiting', val);
            }
        },
        ckErrorNode: {
            value: '.J_CK_ERROR',
            setter: function(val){
                return this._validateNode('Checkcode error', val);
            }
        },
        fetchUrl: {
            value: 'http://promotion.trip.' + this._host + '/weibo/weibo_check_code_url.htm'
        },
        validataUrl: {
            value: 'http://promotion.trip.' + this._host + '/platform/send_mobile_message704.htm?'
        },
        _validateNode: function(name, val){
            var form = this.get('form');
            var node = S.isString(val) ? form.one(val) : val;
            if(S.isNull(node)){
                throw(name + ' node is undefined or null, please check and retry!');
            }
            return node;
        }
    }});

    return Checkcode;
}, {requires : ['ajax', 'node', 'base', 'gallery/placeholder/1.0/']});




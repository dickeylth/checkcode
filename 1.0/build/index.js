/*
combined files : 

gallery/checkcode/1.0/index

*/
/**
 * @fileoverview
 * @author hongshu<tiehang.lth@taobao.com>
 * @module checkcode
 **/
KISSY.add('gallery/checkcode/1.0/index',function (S, IO, Placeholder) {

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

    S.extend(Checkcode, S.Base, /** @lends Checkcode.prototype*/{

        /**
         * init checkcode
         * @param config
         */
        init: function (config) {
            var that = this;

            that.initEnv();

            that.bindUI();
            that.render();
        },
        /**
         * init environment
         */
        initEnv: function () {
            var that = this;
            that._host = location.hostname.indexOf('daily.taobao.net') > 0 ? 'daily.taobao.net' : 'taobao.com';

            //Confirm existing of ua, rely on ua
            if (!ua || ua == '') {
                throw('UA must be existing, please check and retry!');
                return;
            }

            //Add placeholder for input fields in the form
            that.get('form').all('input').each(function (item) {
                if (item.attr('placeholder')) {
                    new Placeholder({node: item});
                }
                if (!item.attr('name') && !item.hasClass('J_CK_INP')) {
                    S.log(item.outerHTML() + ' doesn\'t has name attribute, make sure it won\'t matter form submit.');
                }
            });
        },
        render: function () {
            var that = this;

            that.get('ckInpNode').val("");
            that.updateImg();
            that.hideWaiting();
        },
        fetchCheckcode: function (callback) {
            var that = this;

            var ajaxCfg = {
                url: that.get('fetchUrl') + "?&t=" + S.now(),
                dataType: "jsonp",
                success: function (data) {
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
        updateImg: function () {
            var that = this;

            that.fetchCheckcode(function () {
                var img = that.get('ckImgNode');
                img.attr("src", that._url + "&t=" + new Date().getTime());
            });
        },
        clearCheckcode: function () {
            var that = this;
            that.get('ckLoadingNode').css("display", "none");
            that.clearErr();
            that.updateImg();
        },
        submitFn: function (param) {
            var that = this;
            var validateForm = that.get('validateForm');
            if (validateForm(that)) {
                var url = that.get('validateUrl');
                new IO({
                    type: "get",
                    url: url + "?" + param,
                    form: that.form,
                    success: function (data) {
                        that.fire('subSuccess', data);
                    },
                    error: function () {
                        that.fire('subError');
                    },
                    dataType: "jsonp",
                    timeout: 15
                });
            }
        },
        bindUI: function () {
            var that = this;
            var form = that.get('form');
            var img = that.get('ckImgNode');
            var codeNode = that.get('ckInpNode');
            var errNode = that.get('ckErrorNode');

            form.on('submit', function (e) {
                e.halt();

                if (codeNode.val().length < 4) {
                    errNode.css("display", "block").html('亲，请先输入验证码哦！');
                    return;
                }

                that.showWaiting();
                var param = "checkcode=" + codeNode.val() + "&csk=" + that._csk + "&cst=" + that._cst + "&ua=" + that.flushUA() + "&t=" + S.now();

                that.clearErr();
                that.submitFn(param);

            });

            img.on('click', function () {
                that.updateImg();
            });

            codeNode.on('focus', function () {
                that.setErr("");
            });
        },
        clearErr: function () {
            var that = this;

            that.get('ckErrorNode').html("").hide();

            return that;
        },
        setErr: function (msg) {

            if (msg) {
                var that = this;
                that.hideWaiting();
                that.get('ckErrorNode').html(msg).show();
            }

            return that;
        },
        flushUA: function () {
            var _ua = encodeURIComponent(ua);

            UA_Opt.Token = new Date().getTime() + ":" + Math.random();
            UA_Opt && UA_Opt.reload();

            return _ua;
        },
        showWaiting: function () {
            var that = this;

            var loading = that.get('ckLoadingNode');
            loading.show();

            return that;
        },
        hideWaiting: function () {
            var that = this;

            var loading = that.get('ckLoadingNode');
            loading.hide();

            return that;
        },
        _validateNode: function (name, val) {
            var form = this.get('form');
            var node = S.isString(val) ? form.one(val) : val;
            if (S.isNull(node)) {
                throw(name + ' node is undefined or null, please check and retry!');
            }
            return node;
        },
        _getNode: function (val) {
            return this.get('form').one(val);
        }
    }, {ATTRS: /** @lends Checkcode*/{
        form: {
            value: '',
            setter: function (val) {
                var $ = S.one;
                var form = S.isString(val) ? $(val) : val;
                if (S.isNull(form)) {
                    throw('Form is undefined or null, please check and retry!');
                }
                return form;
            }
        },
        ckImgNode: {
            valueFn: function () {
                return this._getNode('.J_CK_IMG');
            },
            setter: function (val) {
                return this._validateNode('Checkcode image', val);
            }
        },
        ckInpNode: {
            valueFn: function () {
                return this._getNode('.J_CK_INP');
            },
            setter: function (val) {
                return this._validateNode('Checkcode input', val);
            }
        },
        ckLoadingNode: {
            valueFn: function () {
                return this._getNode('.J_CK_LOADING');
            },
            setter: function (val) {
                return this._validateNode('Checkcode loading/waiting', val);
            }
        },
        ckErrorNode: {
            valueFn: function () {
                return this._getNode('.J_CK_ERROR');
            },
            setter: function (val) {
                return this._validateNode('Checkcode error', val);
            }
        },
        fetchUrl: {
            valueFn: function () {
                return 'http://promotion.trip.' + this._host + '/weibo/weibo_check_code_url.htm';
            }
        },
        validateUrl: {
            valueFn: function () {
                return 'http://promotion.trip.' + this._host + '/platform/send_mobile_message704.htm';
            }
        },
        validateForm: {
            value: function () {
                return true;
            },
            setter: function (val) {
                if (!S.isFunction(val)) {
                    throw('Validate form method should be a function, please check and retry!');
                }
            }
        }
    }});

    return Checkcode;
}, {requires: ['ajax', 'gallery/placeholder/1.0/']});

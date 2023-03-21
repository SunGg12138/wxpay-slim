const xml = require('./lib/xml');
const randomStr = require('./lib/randomStr');
const signature = require('./lib/signature');
const rp = require('node-request-slim').promise;

class WxPay {
    constructor ({ appid, mch_id, mch_key, mch_cert, mch_cert_key }) {
        this.appid = appid;
        this.mch_id = mch_id;
        this.mch_key = mch_key;
        this.mch_cert = mch_cert;
        this.mch_cert_key = mch_cert_key;
        this.agentOptions = {
            cert: mch_cert,
            key: mch_cert_key
        };
    }

    /**
     * 统一下单
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
    */
    async unifiedorder (opts) {
        return this.request('https://api.mch.weixin.qq.com/pay/unifiedorder', opts);
    }

    /**
     * 查询订单
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2
    */
    async orderquery (opts) {
        return this.request('https://api.mch.weixin.qq.com/pay/orderquery', opts);
    }

    /**
     * 关闭订单
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_3
    */
    async closeorder (opts) {
        return this.request('https://api.mch.weixin.qq.com/pay/closeorder', opts);
    }

    /**
     * 申请退款
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_4
    */
    async refund (opts) {
        if (!this.mch_cert || !this.mch_cert_key) return Promise.reject({ msg: '未配置API证书信息，不能使用”申请退款“功能' });
        return this.request('https://api.mch.weixin.qq.com/secapi/pay/refund', opts, true);
    }

    /**
     * 查询退款
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5
    */
    async refundquery (opts) {
        return this.request('https://api.mch.weixin.qq.com/pay/refundquery', opts);
    }

    /**
     * 下载交易账单
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_6
    */
    async downloadbill (opts) {
        return this.request('https://api.mch.weixin.qq.com/pay/downloadbill', opts);
    }

    /**
     * 下载资金账单
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_18&index=7
    */
    async downloadfundflow (opts) {
        if (!this.mch_cert || !this.mch_cert_key) return Promise.reject({ msg: '未配置API证书信息，不能使用”下载资金账单“功能' });
        // 下载资金账单目前仅支持HMAC-SHA256
        opts.sign_type = 'HMAC-SHA256';
        return this.request('https://api.mch.weixin.qq.com/pay/downloadfundflow', opts, true);
    }

    /**
     * 交易保障
     * 商户在调用微信支付提供的相关接口时，会得到微信支付返回的相关信息以及获得整个接口的响应时间。为提高整体的服务水平，协助商户一起提高服务质量，微信支付提供了相关接口调用耗时和返回信息的主动上报接口，微信支付可以根据商户侧上报的数据进一步优化网络部署，完善服务监控，和商户更好的协作为用户提供更好的业务体验。
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_8&index=9
    */
    async report (opts) {
        return this.request('https://api.mch.weixin.qq.com/payitil/report', opts);
    }
    
    /**
     * 拉取订单评价数据
     * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_17&index=11
    */
    async batchquerycomment (opts) {
        if (!this.mch_cert || !this.mch_cert_key) return Promise.reject({ msg: '未配置API证书信息，不能使用”拉取订单评价数据“功能' });
        // 拉取订单评价数据目前仅支持HMAC-SHA256
        opts.sign_type = 'HMAC-SHA256';
        return this.request('https://api.mch.weixin.qq.com/billcommentsp/batchquerycomment', opts, true);
    }

    // 通用请求
    async request (url, opts, use_cert) {
        this.attach(opts);

        const req_xml = xml.build(opts);

        const request_options = {
            url: url,
            method: 'POST',
            headers: {
                'content-type': 'text/xml'
            },
            body: req_xml
        };
        if (use_cert) {
            request_options.agentOptions = this.agentOptions;
        }
        
        const res = await rp(request_options);

        // 判断响应的数据是不是xml，是xml，需要解析
        if (this.isXml(res)) {
            const res_json = await xml.parsePromise(res);
            // 返回xml结构
            return res_json.xml;
        }

        // 直接返回响应的数据
        return res;
    }

    // 附带上请求的公共数据(私有方法)
    attach (opts) {
        opts.appid = this.appid;
        opts.mch_id = this.mch_id;
        opts.sign_type = opts.sign_type || 'MD5';
        opts.nonce_str = randomStr();
        opts.sign = signature(opts.sign_type, this.mch_key, opts);
    }

    // 判断是否是xml字符串
    isXml (body) {
        if (typeof body !== 'string') return false;
        return /^<xml>/.test(body);
    }
}

module.exports = WxPay;
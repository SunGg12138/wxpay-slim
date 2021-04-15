// 检查是否已经配置好了wxpay.config文件
try {
    require('./resource/wxpay.config.json');
} catch (error) {
    throw new Error(`
    先配置你的/test/resource/wxpay.config.json文件再测试
    wxpay.config.json是你微信商户的配置文件
    1. 配置你的微信支付信息到/test/resource/wxpay.config.default.json 
    2. 将 wxpay.config.default.json  改名为 wxpay.config.json 
    `);
}

const fs = require('fs');
const expect = require('chai').expect;
const WxPay = require('../');
const wxpay_config = require('./resource/wxpay.config.json');
const wxpay = new WxPay({
    // 公众账号ID
    appid: wxpay_config.appid,
    // 商户号	
    mch_id: wxpay_config.mch_id,
    // 商户秘钥
    mch_key: wxpay_config.mch_key,

    // 设置API证书，如果不使用退款、下载资金账单、拉取订单评价数据，可以不填
    mch_cert: fs.readFileSync(wxpay_config.cert_path),
    mch_cert_key: fs.readFileSync(wxpay_config.cert_key_path)
});

describe('微信支付测试 - 不需要API证书', function () {
    it('统一下单', async function () {
        const result = await wxpay.unifiedorder({
            device_info: '013467007045764',
            sign_type: 'MD5',
            body: '微信支付测试',
            detail: '微信支付模块测试',
            // 参数的值为空不参与签名；
            attach: '',
            out_trade_no: Date.now().toString(),
            fee_type: 'CNY',
            total_fee: 1,
            spbill_create_ip: '127.0.0.1',
            time_start: '20210412091010',
            time_expire: '20501227091010',
            goods_tag: 'WXG',
            notify_url: 'http://www.weixin.qq.com/wxpay/pay.php',
            trade_type: 'JSAPI',
            product_id: '12235413214070356458058',
            limit_pay: 'no_credit',
            openid: wxpay_config.test.openid,
            receipt: 'N',
            profit_sharing: 'N',
            scene_info: '{"store_info" : {"id": "SZTX001","name": "腾大餐厅","area_code": "440305","address": "科技园中一路腾讯大厦" }}'
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });

    it('查询订单', async function () {
        const result = await wxpay.orderquery({
            transaction_id: wxpay_config.test.transaction_id,
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });

    it('关闭订单', async function () {
        const result = await wxpay.closeorder({
            out_trade_no: wxpay_config.test.out_trade_no,
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });

    it('查询退款', async function () {
        const result = await wxpay.refundquery({
            transaction_id: wxpay_config.test.transaction_id,
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });

    it('下载交易账单', async function () {
        const result = await wxpay.downloadbill({
            bill_date: '20210411',
            bill_type: 'ALL'
        });
        // 没有订单时，会返回xml
        if (typeof result === 'object') {
            expect(result.return_msg[0]).to.be.equal('No Bill Exist');
        }
        // 有订单时，会返回文本表格数据
        else {
            expect(result).to.be.a('string');
            expect(result.includes('商户订单号')).to.be.ok;
        }
    });

    it('下载交易账单 - 失败测试(成功为文本表格，失败为xml)', async function () {
        const result = await wxpay.downloadbill({
            bill_type: 'ALL'
        });
        expect(result.return_code[0]).to.be.equal('FAIL');
    });

    it('交易保障', async function () {
        const result = await wxpay.report({
            interface_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            execute_time_: 1000,
            return_code: 'SUCCESS',
            return_msg: 'OK',
            result_code: 'SUCCESS',
            user_ip: '8.8.8.8'
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });
});

describe('微信支付测试 - 需要API证书', function () {
    it('申请退款', async function () {
        const result = await wxpay.refund({
            out_trade_no: wxpay_config.test.out_trade_no,
            out_refund_no: '4200000935202104114805145757',
            total_fee: 1,
            refund_fee: 1,
        });
        expect(result.return_code[0]).to.be.equal('SUCCESS');
    });

    it('下载资金账单', async function () {
        const result = await wxpay.downloadfundflow({
            bill_date: '20210411',
            account_type: 'Basic'
        });
        // 没有订单时，会返回xml，提示：流水账单不存在
        if (typeof result === 'object') {
            expect(result.err_code[0]).to.be.equal('NO_BILL_EXIST');
        }
        // 有订单时，会返回文本表格数据
        else {
            expect(result).to.be.a('string');
            expect(result.includes('微信支付业务单号')).to.be.ok;
        }
    });

    it('下载资金账单 - 失败测试(成功为文本表格，失败为xml)', async function () {
        const result = await wxpay.downloadfundflow({
            account_type: 'Basic'
        });
        expect(result.return_code[0]).to.be.equal('FAIL');
    });

    it('拉取订单评价数据', async function () {
        const result = await wxpay.batchquerycomment({
            begin_time: '20210411000000',
            end_time: '20210412230000',
            offset: 0,
            limit: 10
        });
        // 没有订单时，会返回xml，提示：没有评论数据
        if (typeof result === 'object') {
            expect(result.err_code[0]).to.be.equal('NO_COMMENT');
        }
        // 有订单时，会返回文本表格数据
        else {
            expect(result).to.be.a('string');
            expect(/\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}/.test(result)).to.be.ok;
        }
    });

    it('拉取订单评价数据 - 失败测试(成功为文本表格，失败为xml)', async function () {
        const result = await wxpay.batchquerycomment({
            begin_time: '20210411000000',
            end_time: '20210412230000',
        });
        expect(result.return_code[0]).to.be.equal('FAIL');
    });
});
# 微信支付

微信支付轻量包，使用 ES2017 async functions 来操作微信支付，接口名称与官方接口对应，轻松上手，文档齐全

## 安装

```
npm install wxpay-slim
```

## 方法定义

方法名称                 |      描述        | 官网链接
------------------------|----------------------|--------------------------------
[unifiedorder](#统一下单) | 统一下单 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1)
[orderquery](#查询订单) | 查询订单 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2)
[closeorder](#关闭订单) | 关闭订单 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_3)
[refund](#申请退款) | 申请退款 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_4)
[refundquery](#查询退款) | 查询退款 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5)
[downloadbill](#下载交易账单)  | 下载交易账单 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_6)
[downloadfundflow](#下载资金账单) | 下载资金账单 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_18&index=7)
[report](#交易保障) | 交易保障 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_8&index=9)
[batchquerycomment](#拉取订单评价数据) | 拉取订单评价数据 | [链接](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_17&index=11)

## 测试用例

```bash
# 先配置你的/test/resource/wxpay.config.json文件再测试
# wxpay.config.json是你微信商户的配置文件
# 1. 配置你的微信支付信息到/test/resource/wxpay.config.default.json 
# 2. 将 wxpay.config.default.json  改名为 wxpay.config.json 
# 如果不使用退款、下载资金账单、拉取订单评价数据功能，可以不填mch_cert、mch_cert_key参数
$ mocha
```

## 使用文档

### 初始化微信支付实例

```javascript
const WxPay = require('wxpay-slim');

// 以下文档省略初始化微信支付实例
const wxpay = new WxPay({
    appid: '公众账号ID',
    mch_id: '商户号',
    mch_key: '商户秘钥',
    // 设置API证书，如果不使用退款、下载资金账单、拉取订单评价数据，可以不填
    mch_cert: fs.readFileSync('API证书路径'),
    mch_cert_key: fs.readFileSync('API证书key路径')
});
```

### 统一下单

```javascript
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
    openid: '<某个用户openid>',
    receipt: 'N',
    profit_sharing: 'N',
    scene_info: '{"store_info" : {"id": "SZTX001","name": "腾大餐厅","area_code": "440305","address": "科技园中一路腾讯大厦" }}'
});

// 返回解析xml后的JSON数据
{
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "OK" ],
  "appid": [ "公众账号" ],
  "mch_id": [ "商户ID" ],
  "device_info": [ "013467007045764" ],
  "nonce_str": [ "sZlBTk5kAKGCqdZ2" ],
  "sign": [ "C467C24B196CDDE58D398885E806C376" ],
  "result_code": [ "SUCCESS" ],
  "prepay_id": [ "wx130101176257317953a5acb7c0254d0000" ],
  "trade_type": [ "JSAPI" ]
}
```

### 查询订单

```javascript
const result = await wxpay.orderquery({
    transaction_id: '微信订单号',
});
// 返回解析xml后的JSON数据
{
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "OK" ],
  "appid": [ "公众账号" ],
  "mch_id": [ "商户号" ],
  "nonce_str": [ "8GpSbHmviv3yPOGu" ],
  "sign": [ "1D6162EA991EF1DB95986E8F753D6EB5" ],
  "result_code": [ "SUCCESS" ],
  "openid": [ "某个用户openid" ],
  "is_subscribe": [ "N" ],
  "trade_type": [ "JSAPI" ],
  "bank_type": [ "OTHERS" ],
  "total_fee": [ "1" ],
  "fee_type": [ "CNY" ],
  "transaction_id": [ "微信订单号" ],
  "out_trade_no": [ "商户订单号" ],
  "attach": [ "" ],
  "time_end": [ "20210411230630" ],
  "trade_state": [ "REFUND" ],
  "cash_fee": [ "1" ],
  "trade_state_desc": [ "订单发生过退款，退款详情请查询退款单" ],
  "cash_fee_type": [ "CNY" ]
}
```

### 关闭订单

```javascript
const result = await wxpay.orderquery({
    out_trade_no: '商户订单号'
});
// 返回解析xml后的JSON数据
{
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "OK" ],
  "appid": [ "公众账号" ],
  "mch_id": [ "商户号" ],
  "sub_mch_id": [ "" ],
  "nonce_str": [ "sIsLToYlgw19Txog" ],
  "sign": [ "019AEAFDFFD234CD9E671D0A73F46C90" ],
  "result_code": [ "FAIL" ],
  "err_code": [ "ORDERPAID" ],
  "err_code_des": [ "order paid" ]
}
```

### 查询退款

```javascript
const result = await wxpay.refundquery({
    transaction_id: '微信订单号',
});

// 返回解析xml后的JSON数据
{
  "appid": [ "公众账号" ],
  "cash_fee": [ "1" ],
  "mch_id": [ "商户号" ],
  "nonce_str": [ "0dFLhH97JkgvDRA1" ],
  "out_refund_no_0": [ "4200000935202104114805145757" ],
  "out_trade_no": [ "商户号订单号" ],
  "refund_account_0": [ "REFUND_SOURCE_RECHARGE_FUNDS" ],
  "refund_channel_0": [ "ORIGINAL" ],
  "refund_count": [ "1" ],
  "refund_fee": [ "1" ],
  "refund_fee_0": [ "1" ],
  "refund_id_0": [ "50301607692021041207900037640" ],
  "refund_recv_accout_0": [ "支付用户的零钱" ],
  "refund_status_0": [ "SUCCESS" ],
  "refund_success_time_0": [ "2021-04-12 16:50:50" ],
  "result_code": [ "SUCCESS" ],
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "OK" ],
  "sign": [ "5F2D3AE192E7B57400E4C3A519FD849F" ],
  "total_fee": [ "1" ],
  "transaction_id": [ "微信订单号" ]
}
```

### 下载交易账单

```javascript
const result = await wxpay.downloadbill({
    bill_date: '20210411',
    bill_type: 'ALL'
});

// 失败时-返回解析xml后的JSON数据
{
  "return_code": [ "FAIL" ],
  "return_msg": [ "missing parameter" ],
  "error_code": [ "20001" ]
}

// 成功时-返回文本表格数据
交易时间,公众账号ID,商户号,特约商户号,设备号,微信订单号,商户订单号,用户标识,交易类型,交易状态,付款银行,货币种类,应结订单金额,代金券金额,微信退款单号,商户退款单号,退款金额,充值券退款金额,退款类型,退款状态,商品名称,商户数据包,手续费,费率,订单金额,申请退款金额,费率备注
`2021-04-11 22:55:53,`公众账号ID,`商户号,`0,`,`微信订单号,`商户订单号,`用户标识,`JSAPI,`SUCCESS,`OTHERS,`CNY,`0.01,`0.00,`0,`0,`0.00,`0.00,`,`,`,`,`0.00000,`1.00%,`0.01,`0.00,`
```

### 交易保障

```javascript
const result = await wxpay.report({
    interface_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    execute_time_: 1000,
    return_code: 'SUCCESS',
    return_msg: 'OK',
    result_code: 'SUCCESS',
    user_ip: '8.8.8.8'
});

// 返回解析xml后的JSON数据
{
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "" ],
  "result_code": [ "SUCCESS" ],
  "err_code": [ "0" ],
  "err_code_des": [ "" ]
}
```

### 申请退款

```javascript
const result = await wxpay.refund({
    out_trade_no: '商户订单号',
    out_refund_no: '商户退款单号',
    total_fee: 1,
    refund_fee: 1,
});

// 返回解析xml后的JSON数据
{
  "return_code": [ "SUCCESS" ],
  "return_msg": [ "OK" ],
  "appid": [ "公众账号" ],
  "mch_id": [ "商户号" ],
  "nonce_str": [ "yXcPQgpTtAN6GSgJ" ],
  "sign": [ "741F31643926415C6A089A624C46538F" ],
  "result_code": [ "SUCCESS" ],
  "transaction_id": [ "微信订单号" ],
  "out_trade_no": [ "商户订单号" ],
  "out_refund_no": [ "4200000935202104114805145757" ],
  "refund_id": [ "50301607692021041207900037640" ],
  "refund_channel": [ "" ],
  "refund_fee": [ "1" ],
  "coupon_refund_fee": [ "0" ],
  "total_fee": [ "1" ],
  "cash_fee": [ "1" ],
  "coupon_refund_count": [ "0" ],
  "cash_refund_fee": [ "1" ]
}
```

### 下载资金账单

```javascript
const result = await wxpay.downloadfundflow({
    bill_date: '20210411',
    account_type: 'Basic'
});

// 失败时-返回解析xml后的JSON数据
{
  "return_code": [ "FAIL" ],
  "return_msg": [ "Param Error" ]
}

// 返回文本表格数据
记账时间,微信支付业务单号,资金流水单号,业务名称,业务类型,收支类型,收支金额(元),账户结余(元),资金变更提交申请人,备注,业务凭证号
`2021-04-11 21:35:06,`4200000934202104116411967580,`4200000934202104116411967580,`交易,`交易,`收入,`0.01,`0.01,`system,`结算总金额 0.01 元;含手续费 0.00 元,`1618148094082_GT
```

### 拉取订单评价数据

```javascript
const result = await wxpay.batchquerycomment({
    begin_time: '20210411000000',
    end_time: '20210412230000',
    offset: 0,
    limit: 10
});

// 失败时-返回解析xml后的JSON数据
{
  "return_code": [ "FAIL" ],
  "return_msg": [ "商户签名错误" ]
}

// 返回文本表格数据
`33873
`2021-04-12 20:35:37,`4200000935202104114805145757,`5,`哎呦 不错哦
`2021-04-12 20:35:59,`4200000900202104114217622488,`5,`nice
```
### 通用请求方法

如果微信支付新出了文档但是此模块未及时更新，可以使用通用请求方法请求

request(url, options, use_cert)
- url {string} 请求的url
- options {string} 请求的参数
- use_cert {boolean} 是否需要证书

```javascript
// 使用拉取订单评价数据来举例
const options = {
    begin_time: '20210411000000',
    end_time: '20210412230000',
    offset: 0,
    limit: 10
};

// 请求的结果，如果是xml会解析成JSON，否者直接返回
const result = await wxpay.request('https://api.mch.weixin.qq.com/billcommentsp/batchquerycomment', options, true);


```
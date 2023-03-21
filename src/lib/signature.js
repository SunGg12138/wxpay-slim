const md5 = require('./md5');
const hmac_sha256 = require('./hmac_sha256');

/**
 * 签名算法
 * 文档：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3
 * 签名校验工具：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1
*/
module.exports = function (sign_type, mch_key, obj) {

    const sort_filter_keys = Object.keys(obj)
        // 参数名ASCII码从小到大排序（字典序）；
        .sort()
        // 如果参数的值为空不参与签名(数字0为有效值)
        .filter(key => typeof obj[key] === 'number'? true : obj[key]);

    // 签名字符串
    const stringA = sort_filter_keys.map(key => key + '=' + obj[key]).join('&');

    // stringA最后拼接上key得到stringSignTemp字符串
    const stringSignTemp = stringA + '&key=' + mch_key;

    let signValue;

    if (sign_type === 'MD5') {
        // 对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue
        signValue = md5(stringSignTemp).toUpperCase();
    } else {
        // 对stringSignTemp进行HMAC-SHA256运算，再将得到的字符串所有字符转换为大写，得到sign值signValue
        signValue = hmac_sha256(mch_key, stringSignTemp).toUpperCase();;
    }

    return signValue;
};
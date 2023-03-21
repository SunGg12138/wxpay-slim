const upper_letters = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';
const lower_letters = upper_letters.toLocaleLowerCase();
const string = '0123456789' + upper_letters + lower_letters;
// 生成随机字符串
module.exports = function (len_area = [ 8, 32 ]) {
    // 生成随机字符串的长度
    let len;

    // 长度是一个，直接是字符串的长度
    if (len_area.length === 1) {
        len = len_area[0];
    }
    // 如果是区间，取随机值
    else if (len_area.length > 1) {
        const min_len = Math.max(len_area[0], 8), max_len = Math.min(len_area[1], 32);
        len = Math.floor(Math.random() * (max_len - min_len)) + min_len;
    }
    // 默认是16
    else {
        len = 16;
    }
    
    // 生成
    let result = '', stringLen = string.length;
    for (let i = 0; i < len; i++) {
        const random =  Math.floor(Math.random() * stringLen);
        result += string.charAt(random);
    }

    // 需要返回全大写，不然”拉取订单评价数据“接口会提示签名错误
    return result.toUpperCase();
};
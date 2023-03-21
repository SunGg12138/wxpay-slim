const crypto = require('crypto');

/**
 * HMAC-SHA256签名
 */
module.exports = function(key, str){
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(str);
  let sign = hmac.digest();
  return sign.toString('hex');
};
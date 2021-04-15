const xml2js = require('xml2js');

exports.build = function (json) {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(json);
    return xml;
};

exports.parsePromise = function (xml) {
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(xml);
};

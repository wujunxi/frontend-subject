function Success(data, msg) {
    this.retCode = "00";
    this.retMsg = msg || "success";
    this.data = data || {};
}

function Fail(msg, code) {
    this.retCode = code || "E000";
    this.retMsg = msg || "system busy!";
    this.data = {};
}

module.exports = [{
        reg: /^\/service\/time.json/,
        action: function() { // 动态返回响应
            return new Success({ dateTime: Date.now() });
        }
    },
    {
        reg: /^\/service\/to.json/,
        action: function(param) { // 根据参数动态返回响应
            if (param.type) {
                return new Success(param);
            } else {
                return new Fail("require param 'type'");
            }
        }
    },
    { reg: /^\/service\/weather.json/, action: "proxy:http://api.seniverse.com/v3/weather/now.json?key=p9rbvhrs3aqcxt55&location=guangdongshenzhen&language=zh-Hans&unit=c" }, // 代理
    { reg: /^\/service\/something\/wrong/, action: "redirect:/error.html" }, // 跳转
    { reg: /^\/service\/([^\.]+.json)(\?.*)?/, action: "local:../../data/$1" } // 响应本地json文件
];
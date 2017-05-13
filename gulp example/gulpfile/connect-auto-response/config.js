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
        // 动态返回响应
        action: function() { 
            return new Success({ dateTime: Date.now() });
        }
    },
    {
        reg: /^\/service\/to.json/,
        // 根据参数动态返回响应
        action: function(param) { 
            if (param.type) {
                return new Success(param);
            } else {
                return new Fail("require param 'type'");
            }
        }
    },
    {
        reg: /^\/service\/weather.json/,
        // 代理
        action: "proxy:http://api.seniverse.com/v3/weather/now.json?key=p9rbvhrs3aqcxt55&location=guangdongshenzhen&language=zh-Hans&unit=c" // 心知天气数据
    }, 
    {
        reg: /^\/service\/something\/wrong/,
        // 跳转
        action: "redirect:/error.html"
    }, 
    {
        reg: /^\/service\/([^\.]+.json)(\?.*)?/,
        // 响应本地json文件
        action: "local:../../data/$1"
    } 
];
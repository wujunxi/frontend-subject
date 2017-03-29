const pug = require("pug");

// 渲染字符串
console.log(pug.render("h1.page_title 标题"),'\n');

// 渲染数据
console.log(pug.render("h1.page_title #{title}",{title:"标题"}),'\n');

// 渲染文件
console.log(pug.renderFile("test.pug",{pretty:true,title:"标题"}));
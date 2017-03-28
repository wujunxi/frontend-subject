const pug = require("pug");

// 渲染字符串
console.log(pug.render("h1.page_title 这是标题"));

// 渲染数据
console.log(pug.render("h1.page_title #{title}",{title:"看这里"}));

// 渲染文件
console.log(pug.renderFile("index.pug",{pretty:true,info:"hello,world!"}));
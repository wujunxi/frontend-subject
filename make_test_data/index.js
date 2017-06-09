const fs = require('fs');
const path = require('path');
const DOMParser = require('xmldom').DOMParser;
const cheerio = require('cheerio');

const FILE_PATH = {
    data: './data.xml',
    projects: './project.json'
};

const PROJECT_ROOT = 'D:\\Work\\ue_weixin\\trunk';

var fileStr = fs.readFileSync(FILE_PATH.data, { encoding: 'utf-8' });
// console.log(fileStr);
// var doc = new DOMParser().parseFromString(fileStr);
var $ = cheerio.load(fileStr);

var projectList = [];

function Project(name, rules = []) {
    this.name = name;
    this.rules = rules;
}

function Rule(match, action) {
    this.match = match;
    this.action = action;
}

// 读取xml文件
$("Project").each(function() {
    var $project = $(this);
    var name = $project.attr("name");
    var project = new Project(name); // 属性名小写
    $("ResponseRule", this).each(function() {
        var $rule = $(this);
        var match = $rule.attr("match");
        var action = $rule.attr("action");
        // 替换掉正则表达式符号
        match = match.replace('regex:', '');
        // 替换双反斜杠为斜杠
        action = action.replace(/\\/g, '\/');
        // 替换掉绝对路径为相对路径，如去掉头E:/project/ue_weixin/branches/2.78.0/
        action = action.replace(/^[A-Z]:\/project\/ue_weixin\/branches\/[\d\.]+\//, '');
        var rule = new Rule(match, action);
        project.rules.push(rule);
    });
    projectList.push(project);
});
console.log('source project length:' + projectList.length);

var newProjectList = [];

projectList.forEach(function(project) {
    var newRuleList = [];
    // 过滤为空的project
    if (project.rules.length == 0) {
        console.log('empty project:' + project.name);
        return;
    }
    project.rules.forEach(function(rule) {
        // 过滤掉文件不在测试数据目录下的规则
        if (!/^src\/weixin\/data/.test(rule.action)) {
            console.log('not in data folder:' + rule.action);
            return;
        }
        // 过滤不存在数据文件的规则
        var file_path = path.join(PROJECT_ROOT, rule.action);
        try {
            fs.accessSync(file_path);
            newRuleList.push(rule);
        } catch (e) {
            console.log('not exists:' + file_path);
        }
    });
    if (newRuleList.length == 0) {
        return;
    }
    var newProject = new Project(project.name, newRuleList);
    newProjectList.push(newProject);
});

printProjectList(newProjectList);

fs.writeFileSync(FILE_PATH.projects, JSON.stringify(newProjectList), { encoding: 'utf-8' });


function printProjectList(projectList) {
    if (projectList.length == 0) return;
    projectList.forEach(function(item) {
        console.log(item.name);
        if (item.rules.length == 0) return;
        item.rules.forEach(function(rule) {
            console.log('\t%s -> %s', rule.match, rule.action);
        });
    });
}
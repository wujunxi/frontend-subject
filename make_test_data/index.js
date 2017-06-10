const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FILE_PATH = {
    data: './data.xml',
    projects: './project.json'
};

// const PROJECT_ROOT = 'D:\\Work\\ue_weixin\\trunk';
const PROJECT_ROOT = 'D:\\Work\\2017-06-10\\weixin';
const TEST_DATA_ROOT = './test_data';

var projectList = [];

// 定义数据结构

function Project(name, rules = []) {
    this.name = name;
    this.rules = rules;
}

function Rule(match, action) {
    this.match = match;
    this.action = action;
}

// 读取配置文件
var fileStr = fs.readFileSync(FILE_PATH.data, { encoding: 'utf-8' });
// console.log(fileStr);
// 使用 cheerio 遍历xml
var $ = cheerio.load(fileStr);

// 读取xml文件，格式化数据，构建json对象
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
        // 格式化，去除正排除的则表达式
        match = match.replace(/\[[^\]]+\]/,'');
        // 去除域名
        match = match.replace('https://www.xiaoniu88.com/weixin','/weixin');
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

// 清理数据
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
        // 过滤掉非标准url
        if (!/^\/?weixin/.test(rule.match)) {
            console.log('no standard url:'+rule.match);
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

// printProjectList(newProjectList);
// printNonStandardRule(newProjectList);
// printNonJsonFileRule(newProjectList);
makeTestData(newProjectList,TEST_DATA_ROOT);

// fs.writeFileSync(FILE_PATH.projects, JSON.stringify(newProjectList), { encoding: 'utf-8' });

// fs.statSync('./test_data');

// createFile('./a/b/c/d.json','test');

/**
 * 生成新的测试数据文件
 * 
 * @param {any} projectList 
 * @param {any} dir 
 */
function makeTestData(projectList,dir){
    var count = 0;
    eachRule(projectList,function(rule){
        var _path = rule.match;
        if(!/\.json$/.test(rule.match)){
            _path = rule.match.replace(/\/$/,'') + '.json';
        }
        _path = path.join(dir,_path);
        var from = path.join(PROJECT_ROOT,rule.action);
        var fileStr = fs.readFileSync(from,{encoding:'utf-8'});
        createFile(_path,fileStr)
        console.log('save file : %s',_path);
        count++;
    });

    console.log('total:%d files',count);
}

/**
 * 创建文件
 * 
 * @param {any} _path 
 * @param {any} fileStr 
 */
function createFile(_path,fileStr){
    var dir = path.dirname(_path);
    makeDir(dir);
    fs.writeFileSync(_path,fileStr,{encoding:'utf-8'});
}

/**
 * 
 * 递归创建目录
 * 
 * @param {any} _path 
 */
function makeDir(_path){
    try{
        fs.statSync(_path);
    }catch(e){
        var parent = path.dirname(_path);
        makeDir(parent);
        fs.mkdirSync(_path);
    }
}

/**
 * 
 * 打印非JSON的规则
 * 
 * @param {any} projectList 
 */
function printNonJsonFileRule(projectList){
    eachRule(projectList,function(rule){
        if(!isJsonFile(path.join(PROJECT_ROOT,rule.action))){
            console.log(rule.action);
        }
    });
}


/**
 * 打印非标准规则
 * 
 * @param {any} projectList 
 */
function printNonStandardRule(projectList) {
    eachRule(projectList, function(rule) {
        if (!/^\/?weixin/.test(rule.match)) {
            console.log(rule.match);
        }else if(!/^[_a-zA-Z0-9\/]+$/.test(rule.match)){
            console.log(rule.match);
        }
    });
}

/**
 * 遍历规则
 * 
 * @param {any} projectList 
 * @param {any} cb 
 */
function eachRule(projectList, cb) {
    projectList.forEach(function(project) {
        if (project.rules.length > 0) {
            project.rules.forEach(function(rule) {
                cb(rule, project);
            });
        }
    });
}

/**
 * 
 * 打印工程列表
 * 
 * @param {any} projectList 
 * @returns 
 */
function printProjectList(projectList) {
    if (projectList.length == 0) return;
    projectList.forEach(function(item) {
        console.log(item.name);
        if (item.rules.length == 0) return;
        item.rules.forEach(function(rule) {
            console.log('\t%s -> %s', rule.match, path.join(PROJECT_ROOT, rule.action));
        });
    });
}

/**
 * 
 * 检查是否JSON文件
 * 
 * @param {any} path 
 * @returns 
 */
function isJsonFile(path) {
    var fileStr = fs.readFileSync(path, { encoding: 'utf-8' });
    try {
        var json = JSON.parse(fileStr);
    } catch (e) {
        return false;
    }
    return true;
}
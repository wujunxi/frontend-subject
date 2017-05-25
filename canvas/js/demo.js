// Class Define

function KV(k, v) {
    this.key = k;
    this.val = v;
}

function Action() {
    this.actionType = "";
}

Action.prototype.MOVE = new KV(0, "移动");
Action.prototype.PEN = new KV(1, "画笔");
Action.prototype.ERASER = new KV(2, "橡皮擦");
Action.prototype.COLOR = new KV(3, "颜色");
Action.prototype.SHAPE = new KV(4, "形状");


var colorClassMap = {
    "black": "bg-black",
    "orange": "bg-orange",
    "blue": "bg-blue",
    "red": "bg-red",
    "white": "bg-white",
    "green": "bg-green"
};

var shapeMap = {
    circle: "圆形",
    rectangle: "矩形"
};

function main() {
    var cvs = document.getElementById("canvasMain");
    if (!cvs.getContext) return;
    var ctx = cvs.getContext("2d");
    // drawTest(ctx);
    var isMouseDown = false;
    $("#canvasMain").on("mousemove", function(e) {
        // log(e.offsetX, e.offsetY);
        $("[data-name=position]").text(e.offsetX + "," + e.offsetY);
        if (isMouseDown) {

            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    }).on("mousedown", function(e) {
        log("mousedown");
        isMouseDown = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }).on("mouseup", function(e) {
        log("mouseup");
        isMouseDown = false;
        // ctx.endPath();
    });
    $("body").on("click", "[data-oper]", function() {
        var $this = $(this),
            operName = $this.attr("data-oper");
        var $type = $("[data-name=type]");
        if (operName == "clear") {
            // 清除图形有三种方式
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            // cvs.height = cvs.height;
            // drawRectangle.call(ctx,{x:0,y:0,width:cvs.width,height:cvs.height,color:"#fff"});
        } else if (operName == "pick_color") { // 选择颜色
            var color = $this.attr("data-val");
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            var $color = $("[data-name=color]");
            var newClass = $color.attr("class").replace(/bg-[a-z]+/, colorClassMap[color]);
            $color.attr("class", newClass);
        } else if (operName == "draw_shape") { // 图形
            var shape = $this.attr("data-val");
            // var paramObj = getParam(shape);
            // drawShape.call(ctx, paramObj);
            $type.text(shapeMap[shape]);
            $(".param-bar").children().hide();
            $("[data-name='"+ shape +"-param']").show();
        }
    });
}

function getParam(shape) {
    var $shape = $("[data-name=" + shape + "-param]"),
        paramObj = { shape: shape };
    $("[data-name]", $shape).each(function() {
        var $this = $(this),
            key = $this.attr("data-name"),
            val = $this.val();
        paramObj[key] = val;
    });
    return paramObj;
}

function drawShape(paramObj) {
    // 把第一个字母大写
    var shapeName = paramObj.shape.replace(/^./, function(m) {
        return m.toUpperCase();
    });
    eval("draw" + shapeName + ".call(this,paramObj)");
}

function drawCircle(paramObj) {
    this.beginPath();
    this.arc(paramObj.x, paramObj.y, paramObj.r, 0, Math.PI * 2);
    this.fill();
}

function drawRectangle(paramObj) {
    this.fillRect(paramObj.x, paramObj.y, paramObj.width, paramObj.height);
}

function drawTest(ctx) {
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}

function log(text) {
    console.log(text);
}

/*
1.绘制矩形
fillRect(x, y, width, height)
绘制一个填充的矩形
strokeRect(x, y, width, height)
绘制一个矩形的边框
clearRect(x, y, width, height)
清除指定矩形区域，让清除部分完全透明。

2.颜色填充
fillStyle = color
设置图形的填充颜色。
strokeStyle = color
设置图形轮廓的颜色。

3.路径绘制
beginPath()
新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
closePath()
闭合路径之后图形绘制命令又重新指向到上下文中。
stroke()
通过线条来绘制图形轮廓。
fill()
通过填充路径的内容区域生成实心的图形。

moveTo(x, y)
将笔触移动到指定的坐标x以及y上。
lineTo(x, y)
绘制一条从当前位置到指定x以及y位置的直线。
rect(x, y, width, height)
绘制一个左上角坐标为（x,y），宽高为width以及height的矩形。
quadraticCurveTo(cp1x, cp1y, x, y)
绘制贝塞尔曲线，cp1x,cp1y为控制点，x,y为结束点。
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
绘制二次贝塞尔曲线，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。
arcTo(x1, y1, x2, y2, radius)
根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。
arc(x, y, radius, startAngle, endAngle, anticlockwise)
画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。

*/
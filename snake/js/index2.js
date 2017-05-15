
function P(x,y) {
    this.x = x;
    this.y = y;
}

function Snake(ctx){
    this.ctx = ctx;
    this.head = new P(10,5);
    this.tail = new P(5,5);
    this.pointers = [];
    this.color = "#99cccc";
    this.width = 10;
    this.speed = 10;
}

Snake.prototype.draw = function(){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.tail.x,this.tail.y);
    var i,len,item;
    for(i = 0,len = this.pointers.length; i < len; i++){
        item = this.pointers[i];
        this.ctx.lineTo(item.x,item.y);
    }
    this.ctx.lineTo(this.head.x,this.head.y);
    this.ctx.stroke();
    this.ctx.closePath();
}

Snake.prototype.move = function(dt){
    var d = dt * this.speed / 1000;
    var moveAr = [];
    moveAr.push(this.tail);
    moveAr = moveAr.concat(this.pointers);
    moveAr.push(this.head);
    var i,len,p1,p2;
    for(i = 0,len = this.moveAr.length; i < len - 1; i++){
        p1 = this.moveAr[i];
        p2 = this.moveAr[i+1];
        // 最后一个线段增长
        if(i == len - 2){
            if(p1.x > p2.x){
                p2.x -= d;
            }else if(p1.x < p2.x){
                p2.x += d;
            }else if(p1.y < p2.y){
                p2.y += d;
            }else if(p1.y > p2.y){
                p2.y -= d;
            }
        }else if(i == 0){ // 第一个线段缩短

        }
    }
}

$(function(){

    var cvs = document.getElementById("cvsMain");
    if(!cvs || !cvs.getContext){
        return;
    }

    var ctx = cvs.getContext("2d");

    var snake = new Snake(ctx);
    var lastTs = 0;

    draw();

    function draw(timestamp){
        var dt = timestamp - lastTs;
        lastTs = timestamp;
        ctx.save();
        snake.move(dt).draw();
        ctx.restore();
        window.requestAnimationFrame(draw);
    }

});

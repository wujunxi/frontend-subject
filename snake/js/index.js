function Block(ctx) {
    this.ctx = ctx;
    this.color = "#99cccc";
    this.width = 20;
    this.height = 20;
    this.x = -10;
    this.y = -10;
}

Block.prototype.draw = function() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    return this;
};

function Snake(ctx) {
    this.ctx = ctx;
    this.speed = 10;
    this.head = new Block(ctx);
    this.blocks = [this.head];
}

Snake.prototype.draw = function() {
    var i, len, item;
    for (i = 0, len = this.blocks.length; i < len; i++) {
        item = this.blocks[i];
        item.draw();
    }
    return this;
}

Snake.prototype.move = function(dT) {
    var dx = Math.abs(this.speed * dT);
    
    return this;
}

Snake.prototype.moveTo = function(x,y) {

}

$(function() {

    var cvs = document.getElementById("cvsMain");
    if (!cvs.getContext) {
        alert("error:canvas!");
        return;
    }
    var ctx = cvs.getContext("2d");
    var snake = new Snake(ctx);
    var lastTs = 0,
        isPending = true,
        raf;

    $("#cvsMain").click(function() {
        window.cancelAnimationFrame(raf);
    });

    draw();

    function draw(timestamp) {
        if(!lastTs) lastTs = timestamp;
        var dT = (timestamp - lastTs) / 1000;
        console.log(dT);
        ctx.save();
        ctx.clearRect(0,0,cvs.width,cvs.height);
        snake.move(dT).draw();
        ctx.restore();
        isPending = false;
        run(draw);
    }


    function run(cb) {
        if (!isPending) {
            isPending = true;
            raf = window.requestAnimationFrame(cb);
        }
    }
});
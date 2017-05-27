<template>
  <div class="canvas-wrap" :style="{width:state.width+'px',height:state.height+'px'}" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
    <!--合成层-->
    <canvas id="cvsCom" :width="state.width" :height="state.height">
    </canvas>
    <!--绘制层-->
    <canvas id="cvsDraw" :width="state.width" :height="state.height">
    </canvas>
    <!--操作层-->
    <canvas id="cvsOper" :width="state.width" :height="state.height">
    </canvas>
  </div>
</template>

<script>

export default {
  name: 'layer',
  props: ['state'],
  data: function () {
    return {

    };
  },
  watch: {
    'state.color.foreColor': function (newValue) {
      // 设置新描边色
      this.ctxDraw.strokeStyle = newValue;
      // 设置新填充色
      this.ctxDraw.fillStyle = newValue;
    }
  },
  mounted: function () {
    this.cvsDraw = document.getElementById("cvsDraw");
    this.cvsCom = document.getElementById("cvsCom");
    this.cvsOper = document.getElementById("cvsOper");
    this.ctxDraw = cvsDraw.getContext("2d");
    this.ctxCom = cvsCom.getContext("2d");
    this.ctxOper = cvsOper.getContext("2d");
    this.isMouseDown = false;
    // this.selectRect(100, 100, 100, 100);
  },
  methods: {
    /**
    * 清空画布
    */
    clearDraw: function () {
      this.ctxDraw.clearRect(0, 0, this.cvsDraw.width, this.cvsDraw.height);
    },
    clearOper: function () {
      this.ctxOper.clearRect(0, 0, this.cvsOper.width, this.cvsOper.height);
    },
    /**
    * 擦除圆形区域
    */
    erasurePointer: function (x, y, size) {
      this.ctxDraw.save();
      this.ctxDraw.beginPath();
      this.ctxDraw.arc(x, y, size, 0, Math.PI * 2, true);
      this.ctxDraw.clip();
      this.clearDraw();
      this.ctxDraw.restore();
    },
    /**
     * 绘制一个像素
     * */
    dot: function (x, y) {
      this.ctxDraw.save();
      this.ctxDraw.beginPath()
      this.ctxDraw.arc(x, y, 1, 0, 2 * Math.PI, true);
      this.ctxDraw.fill();
      this.ctxDraw.restore();
    },
    /**
    * 填充正方形区域
    */
    fillRect: function (x, y, width, height) {
      console.log("fillRect:",arguments);
      this.ctxDraw.save();
      this.ctxDraw.fillRect(x, y, width, height);
      this.ctxDraw.restore();
    },
    mousedown: function (e) {
      let x = e.offsetX,
        y = e.offsetY,
        selectArea = this.state.select,
        erasure = this.state.erasure;
      this.isMouseDown = true;
      // 现场保存
      this.ctxDraw.save();
      if (this.state.oper.key == "pen") {
        this.dot(x, y);
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(x, y);
      } else if (this.state.oper.key == "erasure") {
        this.ctxDraw.lineCap = "round";　　//设置线条两端为圆弧
        this.ctxDraw.lineJoin = "round";　　//设置线条转折为圆弧
        this.ctxDraw.lineWidth = erasure.size; // 设置笔触大小
        this.ctxDraw.globalCompositeOperation = "destination-out"; // 设置混合方式
        this.dot(x, y);
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(x, y);
      } else if (this.state.oper.key == "fill") {
        if (selectArea.isActive) {
          this.fillRect(selectArea.x, selectArea.y, selectArea.width, selectArea.height);
        } else {
          this.fillRect(0, 0, this.state.width, this.state.height);
        }
      } else if (this.state.oper.key == "select") {
        this.x = x;
        this.y = y;
      }
    },
    mousemove: function (e) {
      let x = e.offsetX,
        y = e.offsetY;
      if ((this.state.oper.key == "pen" || this.state.oper.key == "erasure") && this.isMouseDown) {
        this.ctxDraw.lineTo(x, y);
        this.ctxDraw.stroke();
      } else if (this.state.oper.key == "select" && this.isMouseDown) {
        this.selectRect(this.x, this.y, x, y);
      }
    },
    mouseup: function (e) {
      let x = e.offsetX,
        y = e.offsetY;
      console.log("mouseup:",this.x, this.y, x, y);
      this.isMouseDown = false;
      // 现场恢复
      this.ctxDraw.restore();
    },
    selectRect: function (x1, y1, x2, y2) {
      var that = this,
        offset = 0,
        selectWidth = x2 - x1,
        selectHeight = y2- y1,
        lastTimestamp;
      // 取消已有选中动画
      if (this.selectRectRaf) {
        window.cancelAnimationFrame(this.selectRectRaf);
      }
      // 设置选中状态
      this.state.select.isActive = true;
      this.state.select.x = x1;
      this.state.select.y = y1;
      this.state.select.width = selectWidth;
      this.state.select.height = selectHeight;
      // 动画帧绘制
      function draw(timestamp) {
        if (!lastTimestamp) {
          lastTimestamp = timestamp;
        } else {
          offset = ((timestamp - lastTimestamp) * 0.02 + offset) % 14;
          lastTimestamp = timestamp;
          that.ctxOper.save();
          that.clearOper();
          that.ctxOper.strokeStyle = "#000";
          that.ctxOper.setLineDash([4, 3]);
          that.ctxOper.lineDashOffset = -offset;
          that.ctxOper.strokeRect(x1, y1, selectWidth, selectHeight);
          that.ctxOper.restore();
        }
        that.selectRectRaf = window.requestAnimationFrame(draw);
      }
      draw();
    },
    cancelSelect:function(){
      // 设置选中状态
      this.state.select.isActive = false;
      // 取消已有选中动画
      if (this.selectRectRaf) {
        window.cancelAnimationFrame(this.selectRectRaf);
        this.clearOper();
      }
    }
  }
}
</script>

<style>
.canvas-wrap canvas {
  position: absolute;
}
</style>

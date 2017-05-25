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
  },
  methods: {
    /**
    * 清空画布
    */
    clearDraw: function () {
      this.ctxDraw.clearRect(0, 0, this.cvsDraw.width, this.cvsDraw.height);
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
        this.dot(x,y);
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(x, y);
      } else if (this.state.oper.key == "erasure") {
        this.ctxDraw.lineCap = "round";　　//设置线条两端为圆弧
        this.ctxDraw.lineJoin = "round";　　//设置线条转折为圆弧
        this.ctxDraw.lineWidth = erasure.size; // 设置笔触大小
        this.ctxDraw.globalCompositeOperation = "destination-out"; // 设置混合方式
        this.dot(x,y);
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(x, y);
      } else if (this.state.oper.key == "fill") {
        if (selectArea.isActive) {
          this.fillRect(selectArea.x, selectArea.y, selectArea.width, selectArea.height);
        } else {
          this.fillRect(0, 0, this.state.width, this.state.height);
        }
      }
    },
    mousemove: function (e) {
      let x = e.offsetX,
        y = e.offsetY;
      if ((this.state.oper.key == "pen" || this.state.oper.key == "erasure") && this.isMouseDown) {
        this.ctxDraw.lineTo(x, y);
        this.ctxDraw.stroke();
      }
    },
    mouseup: function (e) {
      this.isMouseDown = false;
      // 现场恢复
      this.ctxDraw.restore();
    }
  }
}
</script>

<style>
.canvas-wrap canvas {
  position: absolute;
}
</style>

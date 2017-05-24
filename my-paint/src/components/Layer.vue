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
    'state.foreColor': function (newValue) {
      this.ctxDraw.strokeStyle = newValue;
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
    clearDraw: function () {
      this.ctxDraw.clearRect(0, 0, this.cvsDraw.width, this.cvsDraw.height);
    },
    erasurePointer: function (x, y, size) {
      this.ctxDraw.save();
      this.ctxDraw.beginPath();
      this.ctxDraw.arc(x, y, size, 0, Math.PI * 2, true);
      this.ctxDraw.clip();
      this.clearDraw();
      this.ctxDraw.restore();
    },
    mousedown: function (e) {
      this.isMouseDown = true;
      if (this.state.operTypeKey == "pen") {
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(e.offsetX, e.offsetY);
      } else if (this.state.operTypeKey == "erasure") {
        this.erasurePointer(e.offsetX, e.offsetY, this.state.erasureSize);
      }
    },
    mousemove: function (e) {
      if (this.state.operTypeKey == "pen" && this.isMouseDown) {
        this.ctxDraw.lineTo(e.offsetX, e.offsetY);
        this.ctxDraw.stroke();
      } else if (this.state.operTypeKey == "erasure" && this.isMouseDown) {
        this.erasurePointer(e.offsetX, e.offsetY, this.state.erasureSize);
      }
    },
    mouseup: function (e) {
      this.isMouseDown = false;
    }
  }
}
</script>

<style>
.canvas-wrap canvas {
  position: absolute;
}
</style>

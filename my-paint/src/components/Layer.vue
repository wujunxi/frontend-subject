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
    mousedown: function (e) {
      this.isMouseDown = true;
      if (this.state.operTypeKey == "pen") {
        this.ctxDraw.beginPath();
        this.ctxDraw.moveTo(e.offsetX, e.offsetY);
      }
    },
    mousemove: function (e) {
      if (this.state.operTypeKey == "pen" && this.isMouseDown) {
        this.ctxDraw.lineTo(e.offsetX, e.offsetY);
        this.ctxDraw.stroke();
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

<template>
    <div id="app">
        <tool-bar position="left" @showColorPannel="showColorPannel"></tool-bar>
        <div id="divMain">
            <layer :width="600" :height="600"></layer>
        </div>
        <!--<tool-bar position="right"></tool-bar>-->
        <color-panel ref="colorPanel"></color-panel>
    </div>
</template>

<script>
import Layer from './components/Layer'
import ToolBar from './components/ToolBar'
import ColorPanel from './components/ColorPanel'

export default {
    name: 'myPaint',
    data: function () {
        return {
            
        }
    },
    components: {
        Layer,
        ToolBar,
        ColorPanel
    },
    methods: {
        showColorPannel: function (color) {
            this.$refs.colorPanel.show(color);
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

html {
    height: 100%;
}

body {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background: #333;
}

#app {
    width: 100%;
    height: 100%;
}

#divMain {
    background: url(assets/bg.svg);
    background-size: 20px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

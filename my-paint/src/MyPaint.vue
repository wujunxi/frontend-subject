<template>
    <div id="app">
        <tool-bar position="left" :menuData="menuData" :foreColor="foreColor" :backColor="backColor" @showColorPanel="showColorPanel" @selectedOperType="selectedOperType"></tool-bar>
        <div id="divMain" :class="[menuData[operTypeKey].cursorClass]">
            <layer :width="600" :height="600" :operTypeKey="operTypeKey"></layer>
        </div>
        <!--<tool-bar position="right"></tool-bar>-->
        <color-panel ref="colorPanel" @selectedColor="selectedColor"></color-panel>
    </div>
</template>

<script>
import Layer from './components/Layer'
import ToolBar from './components/ToolBar'
import ColorPanel from './components/ColorPanel'

const menuData = {
    "pen":{
        key: "pen",
        name: "画笔",
        cursorClass:"cur-pen",
        isSelected: true
    },
    "erasure":{
        key: "erasure",
        name: "擦除",
        cursorClass:"cur-erasure",
        isSelected: false
    },
    "shape":{
        key: "shape",
        name: "图形",
        cursorClass:"cur-select",
        isSelected: false
    },
};

export default {
    name: 'myPaint',
    data: function () {
        return {
            foreColor: '#000',
            backColor: '#fff',
            operTypeKey: "pen",
            menuData: menuData
        }
    },
    components: {
        Layer,
        ToolBar,
        ColorPanel
    },
    methods: {
        showColorPanel: function (color) {
            this.$refs.colorPanel.show(color);
        },
        selectedColor: function (color) {
            this.foreColor = color;
        },
        selectedOperType:function(key){
            let k,item;
            this.operTypeKey = key;
            for(k in menuData){
                item = menuData[k];
                item.isSelected = item.key == key;
            }
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
    font-size: 14px;
}

input,
button {
    border: solid 1px #838383;
    font-size: 14px;
    height: 20px;
    padding: 0 3px;
    box-sizing: border-box;
}

button {
    background: #e1e1e1;
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

.cur-pen {
    cursor:url(assets/pen.png) 0 -32,auto;
}

.cur-select {
    cursor:crosshair;
}

.cur-erasure {
    cursor:url(assets/erasure.png),auto;
}
</style>

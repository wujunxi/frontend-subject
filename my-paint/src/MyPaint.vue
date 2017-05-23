<template>
    <div class="app">
        <header>
            <menu-bar class="fl" :menuData="menuData"></menu-bar>
            <span class="fr">x:{{state.x}},y:{{state.y}}</span>
        </header>
        <main>
            <tool-bar position="left" :toolData="toolData" :state="state" @showColorPanel="showColorPanel" @selectedOperType="selectedOperType"></tool-bar>
            <div :class="['paint-zone',cursorClass]" @mousemove="changeXY">
                <layer ref="paintLayer" :state="state"></layer>
            </div>
            <!--<tool-bar position="right"></tool-bar>-->
            <color-panel ref="colorPanel" @selectedColor="selectedColor"></color-panel>
        </main>
        <footer></footer>
    </div>
</template>

<script>
import Layer from './components/Layer'
import ToolBar from './components/ToolBar'
import MenuBar from './components/MenuBar'
import ColorPanel from './components/ColorPanel'

const toolData = {
    "pen": {
        key: "pen",
        name: "画笔",
        cursorClass: "cur-pen",
        isSelected: true
    },
    "erasure": {
        key: "erasure",
        name: "擦除",
        cursorClass: "cur-erasure",
        isSelected: false
    },
    "shape": {
        key: "shape",
        name: "图形",
        cursorClass: "cur-select",
        isSelected: false
    },
};

const menuData = {
    "file":{
        key:"file",
        name:"文件"
    },
    "view":{
        key:"view",
        name:"查看"
    },
    "edit":{
        key:"edit",
        name:"编辑"
    },
    "canvas":{
        key:"canvas",
        name:"画布",
        sub:{
            "clear":{
                key:"clear",
                name:"清空画布",
                action:"canvas.clear"
            }
        }
    },
    "layer":{
        key:"layer",
        name:"图层"
    },
    "setting":{
        key:"setting",
        name:"设置"
    },
    "about":{
        key:"about",
        name:"关于"
    }
};

export default {
    name: 'myPaint',
    data: function () {
        return {
            state: {
                x:0,
                y:0,
                height: 600,
                width: 600,
                foreColor: '#000',
                backColor: '#fff',
                operTypeKey: "pen"
            },
            toolData: toolData,
            menuData: menuData
        }
    },
    computed:{
        cursorClass:function(){
            return toolData[this.state.operTypeKey].cursorClass;
        }
    },
    components: {
        MenuBar,
        Layer,
        ToolBar,
        ColorPanel
    },
    methods: {
        changeXY:function(e){
            this.state.x = e.offsetX;
            this.state.y = e.offsetY;
        },
        showColorPanel: function (color) {
            this.$refs.colorPanel.show(color);
        },
        selectedColor: function (color) {
            this.state.foreColor = color;
        },
        selectedOperType: function (key) {
            let k, item;
            this.state.operTypeKey = key;
            for (k in toolData) {
                item = toolData[k];
                item.isSelected = item.key == key;
            }
        }
    }
}
</script>

<style>

.app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

header {
    padding:0 10px;
    height:30px;
    line-height: 30px;
    background:#f0f0f0;
}

main {
    flex:1;
    position:relative;
}

.paint-zone {
    background: url(assets/bg.svg);
    background-size: 20px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.cur-pen {
    cursor: url(assets/pen.png), auto;
}

.cur-select {
    cursor: crosshair;
}

.cur-erasure {
    cursor: url(assets/erasure.png), auto;
}
</style>

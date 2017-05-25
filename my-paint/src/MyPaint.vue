<template>
    <div class="app">
        <header>
            <!-- 菜单 -->
            <menu-bar class="fl" :menuData="menuData" @doAction="doAction"></menu-bar>
            <!-- 坐标 -->
            <span class="fr">x:{{state.x}},y:{{state.y}}</span>
        </header>
        <main>
            <!-- 操作栏 -->
            <tool-bar position="left" :toolData="toolData" :state="state" @showColorPanel="showColorPanel" @selectedOperType="selectedOperType"></tool-bar>
            <!-- 画布 -->
            <div :class="['paint-zone',cursorClass]" @mousemove="changeXY">
                <!-- 绘制图层 -->
                <layer ref="paintLayer" :state="state"></layer>
            </div>
            <!-- 色板 -->
            <color-panel ref="colorPanel" :color="state.color.foreColor" @selectedColor="selectedColor"></color-panel>
        </main>
    </div>
</template>

<script>
import Layer from './components/Layer'
import ToolBar from './components/ToolBar'
import MenuBar from './components/MenuBar'
import ColorPanel from './components/ColorPanel'

// 配置参数
import menuData from './config/menu.config'
import toolData from './config/tool.config'

export default {
    name: 'myPaint',
    data: function () {
        return {
            state: {
                x: 0,
                y: 0,
                height: 600,
                width: 600,
                color:{
                    foreColor: '#000', // 前景色
                    backColor: '#fff' // 背景色
                },
                oper:{
                    key: "pen" // 操作类型
                },
                pen:{
                    size:10, // 笔触大小
                },
                select:{
                    isActive:false, // 是否有选中区域
                    x:0,
                    y:0,
                    width:0,
                    height:0
                },
                erasure:{
                    size:20 // 橡皮擦笔触大小
                }
            },
            toolData: toolData,
            menuData: menuData
        }
    },
    computed: {
        cursorClass: function () {
            return toolData[this.state.oper.key].cursorClass;
        }
    },
    components: {
        MenuBar,
        Layer,
        ToolBar,
        ColorPanel
    },
    methods: {
        doAction: function (action) {
            console.log(action);
            switch (action) {
                case "canvas.clear":
                    this.clear();
                    break;
                default:
                    break;
            }
        },
        clear: function () {
            this.$refs.paintLayer.clearDraw();
        },
        changeXY: function (e) {
            this.state.x = e.offsetX;
            this.state.y = e.offsetY;
        },
        showColorPanel: function () {
            this.$refs.colorPanel.show();
        },
        selectedColor: function (color) {
            this.state.color.foreColor = color;
        },
        selectedOperType: function (key) {
            let k, item;
            this.state.oper.key = key;
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
    overflow: hidden;
}

header {
    padding: 0 10px;
    width: 100%;
    height: 30px;
    min-width: 960px;
    box-sizing: border-box;
    line-height: 30px;
    background: #f0f0f0;
    position: absolute;
    z-index: 1;
}

main {
    padding: 30px 0 0 0;
    height: 100%;
    box-sizing: border-box;
    position: relative;
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

.cur-fill {
    cursor: url(assets/fill.png), auto;
}

.cur-select {
    cursor: crosshair;
}

.cur-move {
    cursor: move;
}

.cur-erasure {
    cursor: url(assets/erasure.png), auto;
}
</style>

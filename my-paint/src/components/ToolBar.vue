<template>
    <div :class="['tool-bar',pos]">
        <div class="color">
            <span class="back" :style="{'background-color':color.backColor}"></span>
            <span class="fore" :style="{'background-color':color.foreColor}" @click="showColorPannel"></span>
        </div>
        <ul class="menu">
            <li v-for="item in menuList" @click="select(item.key)">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>

<script>
const classPosition = { left: "tb-left", right: "tb-right" };
const menuData = [
    {
        key: "pen",
        name: "画笔"
    },
    {
        key: "erasure",
        name: "擦除"
    },
    {
        key: "shape",
        name: "图形"
    },
];

export default {
    name: "tool-bar",
    props: {
        position: {
            type: String,
            default: "left",
            validator: function (value) {
                return value in classPosition;
            }
        }
    },
    data: function () {
        return {
            pos: classPosition[this.position],
            color: {
                foreColor: '#000',
                backColor: '#fff',
            },
            menuList: menuData
        };
    },
    methods: {
        select: function (key) {
            // to-do
            alert(key);
        },
        showColorPannel: function () {
            this.$emit("showColorPannel", this.color);
        }
    }
}
</script>

<style scoped>
.tool-bar {
    display: block;
    height: 100%;
    width: 50px;
    color: #ececec;
    background: #535353;
    overflow: hidden;
    position: fixed;
}

.tb-left {
    left: 0;
}

.tb-right {
    right: 0;
}

.color {
    width: 40px;
    height: 45px;
    overflow: hidden;
    position: relative;
}

.fore,
.back {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    box-shadow: #333 1px 1px 1px;
    cursor: pointer;
}

.fore {
    top: 10px;
    left: 10px;
}

.back {
    top: 15px;
    left: 15px;
}

.menu {
    float: left;
    overflow: hidden;
}

.menu li {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
}

.menu li:hover {
    background: #333;
}
</style>

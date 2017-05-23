<template>
    <div :class="['tool-bar',pos]">
        <div class="color">
            <span class="back" :style="{'background-color':state.backColor}"></span>
            <span class="fore" :style="{'background-color':state.foreColor}" @click="showColorPannel"></span>
        </div>
        <ul class="menu">
            <li v-for="item in toolData" @click="select(item.key)" :class="item.isSelected ? 'on':''">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>

<script>
const classPosition = { left: "tb-left", right: "tb-right" };

export default {
    name: "tool-bar",
    props: {
        position: {
            type: String,
            default: "left",
            validator: function (value) {
                return value in classPosition;
            }
        },
        state:{
            type:Object
        },
        toolData :{
            type:Object,
            required:true
        }
    },
    data: function () {
        return {
            pos: classPosition[this.position]
        };
    },
    methods: {
        select: function (key) {
            this.$emit("selectedOperType",key);
        },
        showColorPannel: function () {
            this.$emit("showColorPanel", this.foreColor);
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
    position: absolute;
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
    overflow: hidden;
}

.menu li {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
}

.menu li:hover {
    background: #333;
}

.menu li.on {
    background: #333;
}
</style>

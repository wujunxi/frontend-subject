<template>
    <div class="color-panel" :style="{display:isShow?'block':'none'}">
        <h3>拾色器
            <i class="icon-close" @click="hide"></i>
        </h3>
        <div class="color-content">
            <ul class="color-list">
                <li v-for="item of colorList" class="color-cell" :style="{background:item}"></li>
            </ul>
            <div class="selected-color">
                <div :style="{background:color.foreColor}"></div>
                <div :style="{background:color.backColor}"></div>
            </div>
        </div>
    </div>
</template>

<script>
const colorData = (function () {
    let ar = [], b16, index, v, flag = false, temp, prev;
    for (let i = 0, len = 36; i < len; i++) {
        v = i % 6;
        flag = (v == 0 ? !flag : flag);
        index = Math.floor(i / 6);
        b16 = flag ? (v * 3).toString(16) : (15 - v * 3).toString(16);
        temp = ['#f0' + b16, '#' + b16 + '0f', '#0' + b16 + 'f', '#0f' + b16, '#' + b16 + 'f0', '#f' + b16 + '0'][index];
        if (i == 0 || temp != prev) {
            ar.push(temp);
            prev = temp;
            // console.log(temp,ar.length);
        }
    }
    return ar;
})();

export default {
    name: "color-panel",
    props: [],
    data: function () {
        return {
            colorList: colorData,
            isShow: false,
            color: { foreColor: '#000', backColor: '#fff' }
        };
    },
    methods: {
        show: function () {
            this.isShow = true;
        },
        hide: function () {
            this.isShow = false;
        }
    }
}
</script>

<style scoped>
.color-panel {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #dedede;
}

.color-panel h3 {
    background: #fff;
    font-size: 14px;
    height: 26px;
    line-height: 26px;
    font-weight: normal;
}

.color-content {
    padding: 20px;
}

.color-list {
    overflow: hidden;
}

.color-cell {
    width: 20px;
    height: 10px;
}

.icon-close {
    float: right;
    box-sizing: border-box;
    height: 26px;
    width: 26px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.icon-close:before {
    display: block;
    content: "";
    width: 50%;
    height: 2px;
    background: #333;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}

.icon-close:after {
    display: block;
    content: "";
    height: 50%;
    width: 2px;
    background: #333;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}
</style>


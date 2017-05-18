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
                <label>旧的</label>
                <div :style="{background:color}"></div>
                <div :style="{background:newColor}"></div>
                <label>新的</label>
            </div>
            <div class="color-rgb mt-10">
                <div class="row">
                    <label class="key">R：</label>
                    <input type="text" class="input" v-model.lazy="R" maxlength="3" />
                </div>
                <div class="row">
                    <label class="key">G：</label>
                    <input type="text" class="input" v-model.lazy="G" maxlength="3" />
                </div>
                <div class="row">
                    <label class="key">B：</label>
                    <input type="text" class="input" v-model.lazy="B" maxlength="3" />
                </div>
            </div>
            <div class="color-base16 mt-10">
                <div class="row">
                    <label class="key ta-right">#&nbsp;</label>
                    <input type="text" class="input w-48" v-model="base16" maxlength="6" />
                </div>
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
            color: '#000',
            newColor:'#000',
            R:"0",
            G:"0",
            B:"0",
            base16:"000"
        };
    },
    computed:{
        newColor:function(){
            return 
        }
    },
    methods: {
        show: function (color) {
            this.color = color;
            this.isShow = true;
        },
        hide: function () {
            this.isShow = false;
        },
        changeRGB:function(){

        },
        changeNewColor:function(){
            this.newColor = '#'+toBase16(this.R,2) + toBase16(this.G,2) + toBase16(this.B,2);
        }
    }
}

function toBase16(v,len){
    var _len = len || 1;
    var temp = parseInt(v).toString(16);
    while(temp.length < _len){
        temp = '0'+temp;
    }
    return temp;
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
    text-indent: 10px;
}

.color-content {
    padding: 20px;
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

.color-list {
    float: left;
    overflow: hidden;
}

.selected-color {
    width:48px;
    overflow: hidden;
    text-align: center;
    font-size:12px;
}

.selected-color>div {
    width:48px;
    height:24px;
}

.selected-color,
.color-rgb,
.color-base16 {
    margin: 0 0 0 40px;
}

.color-content .row {
    overflow: hidden;
    line-height: 22px;
    margin: 3px 0 0 0;
}

.color-content .row:first-child {
    margin: 0;
}

.color-content .key {
    width: 26px;
    float: left;
}

.color-content .input {
    width: 24px;
    height: 18px;
    padding: 0 3px;
    float: left;
}

.color-content .w-48 {
    width: 48px;
}

.ta-right {
    text-align: right;
}

.mt-10 {
    margin-top: 10px;
}
</style>


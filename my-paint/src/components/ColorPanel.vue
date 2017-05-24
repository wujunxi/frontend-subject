<template>
    <div class="color-panel" :style="{display:isShow?'block':'none'}">
        <!--标题-->
        <h3>拾色器
            <i class="icon-close" @click="hide"></i>
        </h3>
        <div class="color-content">
            <!--色表-->
            <ul class="color-list">
                <li v-for="item of colorList" :class="['color-cell', item.isSelected ? 'selected':'']" :style="{background:item.color}" @click="selectColor(item.color)"></li>
            </ul>
            <!--选中颜色-->
            <div class="selected-color">
                <label>旧的</label>
                <div :style="{background:color}"></div>
                <div :style="{background:newColor}"></div>
                <label>新的</label>
            </div>
            <!--RGB颜色表示法-->
            <div class="color-rgb mt-10">
                <div class="row">
                    <label class="key">R：</label>
                    <input type="text" class="input" :value="R" @input="updateR($event.target.value)" maxlength="3" />
                </div>
                <div class="row">
                    <label class="key">G：</label>
                    <input type="text" class="input" :value="G" @input="updateG($event.target.value)" maxlength="3" />
                </div>
                <div class="row">
                    <label class="key">B：</label>
                    <input type="text" class="input" :value="B" @input="updateB($event.target.value)" maxlength="3" />
                </div>
            </div>
            <!--十六进制颜色表示法-->
            <div class="color-base16 mt-10">
                <div class="row">
                    <label class="key ta-right">#&nbsp;</label>
                    <input type="text" class="input w-48" :value="base16" @input="updateBase16($event.target.value)" maxlength="6" />
                </div>
            </div>
            <button class="btn-sure" @click="onSure">确认</button>
        </div>
    </div>
</template>

<script>

function ColorItem(color, isSelected) {
    this.color = color;
    this.isSelected = isSelected;
}

const colorList = (function () {
    let ar = [], b16, index, v, flag = false, temp, prev;
    for (let i = 0, len = 35; i < len; i++) {
        v = i % 6;
        flag = (v == 0 ? !flag : flag);
        index = Math.floor(i / 6);
        b16 = flag ? (v * 3).toString(16) : (15 - v * 3).toString(16);
        temp = ['#f0' + b16, '#' + b16 + '0f', '#0' + b16 + 'f', '#0f' + b16, '#' + b16 + 'f0', '#f' + b16 + '0'][index];
        // 3位补全为6位
        temp = temp.replace(/([\da-f])/g, "$1$1");
        if (i == 0 || temp != prev) {
            ar.push(new ColorItem(temp, false));
            prev = temp;
            // console.log(temp,ar.length);
        }
    }
    return ar;
})();

const COLOR_SOURCE = { RGB: 0, BASE16: 1, PICK: 2 };

export default {
    name: "color-panel",
    props: {
        color:{
            type:String,
            default:'#000000'
        }
    },
    data: function () {
        return {
            COLOR_SOURCE: COLOR_SOURCE,
            colorList: colorList,
            isShow: false,
            newColor: '#000000',
            R: "0",
            G: "0",
            B: "0",
            base16: "000000"
        };
    },
    computed: {

    },
    methods: {
        onSure:function(){
            this.$emit('selectedColor',this.newColor);
            this.isShow = false;
        },
        show: function () {
            this.isShow = true;
        },
        hide: function () {
            this.isShow = false;
        },
        updateR: function (r) {
            this.R = r;
            let temp = parseInt(r);
            if (!isNaN(temp) && temp > -1 && temp < 256) {
                this.updateNewColor(COLOR_SOURCE.RGB);
            }
        },
        updateG: function (g) {
            this.G = g;
            let temp = parseInt(g);
            if (!isNaN(temp) && temp > -1 && temp < 256) {
                this.updateNewColor(COLOR_SOURCE.RGB);
            }
        },
        updateB: function (b) {
            this.B = b;
            let temp = parseInt(b);
            if (!isNaN(temp) && temp > -1 && temp < 256) {
                this.updateNewColor(COLOR_SOURCE.RGB);
            }
        },
        updateRGB: function (color,notPop) {
            let temp = formateBase16(color.substr(1));
            if(temp != ""){
                this.R = parseInt(temp.substr(0,2),16);
                this.G = parseInt(temp.substr(2,2),16);
                this.B = parseInt(temp.substr(4,2),16);
                if(!notPop){
                    this.updateNewColor(COLOR_SOURCE.RGB);
                }
            }
        },
        updateBase16: function (v) {
            this.base16 = v;
            let temp = formateBase16(v);
            if (temp != "") {
                this.updateNewColor(COLOR_SOURCE.BASE16, '#' + temp);
            }
        },
        selectColor: function (color, notPop) {
            this.colorList.forEach(function (item, index) {
                item.isSelected = item.color == color;
            });
            if (!notPop) {
                this.updateNewColor(COLOR_SOURCE.PICK, color);
            }
        },
        updateNewColor: function (source, color) {
            let temp, v;
            // to-do watch model
            if (source == COLOR_SOURCE.RGB) {
                temp = toBase16(this.R, 2) + toBase16(this.G, 2) + toBase16(this.B, 2);
                this.newColor = '#' + temp;
                this.base16 = temp;
                this.selectColor(this.newColor, true);
            } else if (source == COLOR_SOURCE.BASE16) {
                v = color.substr(1);
                this.newColor = color;
                this.updateRGB(color,true);
                this.selectColor(this.newColor, true);
            } else if (source == COLOR_SOURCE.PICK) {
                this.newColor = color;
                this.updateRGB(color,true);
                this.base16 = color.substr(1);
            }
        }
    }
}

/**
 * 格式化16进制颜色值，格式不正确返回空字符串
 * @param v 3位或6位16进制颜色值
 * */
function formateBase16(v) {
    if (!/^([\da-f]{3}){1,2}$/.test(v)) {
        return "";
    }
    if (v.length == 3) {
        return v.replace(/([\da-f])/g, "$1$1");
    }
    return v;
}

/**
 * 十进制转化为16进制，不足位数补零
 * @param v 整数
 * @param len 长度
 * */
function toBase16(v, len) {
    var _len = len || 1;
    var temp = parseInt(v).toString(16);
    while (temp.length < _len) {
        temp = '0' + temp;
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
    background: #ededed;
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
    position:relative;
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
    list-style: none;
    float: left;
}

.color-list .selected:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    border-right: solid 5px #000;
    margin: 0 0 0 22px;
    position: absolute;
}

.selected-color {
    width: 48px;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
}

.selected-color>div {
    width: 48px;
    height: 24px;
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
    width: 34px;
    float: left;
}

.color-content .w-48 {
    width: 58px;
}

.btn-sure {
    position:absolute;
    bottom:20px;
    right:20px;
}

.ta-right {
    text-align: right;
}

.mt-10 {
    margin-top: 10px;
}
</style>


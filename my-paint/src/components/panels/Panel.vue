<template>
    <div class="panel">
        <div class="panel-hd">
            <i v-if="moveable" class="panel-move" @mousedown="onMoveStart" @mousemove="onMove" @mouseup="onMoveEnd"></i>
            {{title}}
            <i v-if="closeable" class="panel-close"></i>
            <i v-if="collapsable" class="panel-collapse"></i>
        </div>
        <div class="panel-bd">
            <slot>
                Empty
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "panel",
    data: function () {
        return {};
    },
    props: {
        title: {
            require: true,
            default: "panel",
            type: String
        },
        moveable: {
            require: false,
            default: true,
            type: Boolean
        },
        closeable: {
            require: false,
            default: true,
            type: Boolean
        },
        collapsable: {
            require: false,
            default: true,
            type: Boolean
        }
    },
    methods: {
        onMoveStart : function(){
            console.log("moveStart:");
            this.isMouseDown = true;
        },
        onMove:function(){
            console.log("move:");
        },
        onMoveEnd:function(){
            console.log("moveEnd:");
            this.isMouseDown = false;
        }
    }
}
</script>

<style>
.panel {
    position: absolute;
    right: 0;
    top: 30px;
    font-size:12px; 
    background: #ededed;
}

.panel-hd {
    background: #fff;
    font-size: 14px;
    height: 26px;
    line-height: 26px;
    font-weight: normal;
    text-indent: 10px;
}

.panel-bd {
    padding: 20px;
    overflow: hidden;
    position:relative;
}

.panel-move {
    float:left;
    box-sizing:border-box;
    height:25px;
    width:13px;
    background:url(../../assets/move_icon.svg) center center / 50% 100% no-repeat;
    cursor:move;
}

.panel-close,.panel-collapse {
    float: right;
    box-sizing: border-box;
    height: 25px;
    width: 26px;
    position: relative;
    overflow: hidden;
    cursor: default;
    position:relative;
}

.panel-close:hover,.panel-collapse:hover {
    background:#ededed;
}

.panel-collapse:before {
    display: block;
    content: "";
    width: 0;
    height:0;
    border:solid 5px transparent;
    border-bottom:none;
    border-top:solid 10px #333;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
}

.panel-close:before {
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

.panel-close:after {
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


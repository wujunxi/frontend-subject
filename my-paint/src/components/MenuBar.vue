<template>
    <div>
        <ul class="menu">
            <!-- 一级菜单 -->
            <li v-for="item in menuData" @mouseenter="showSubMenu($event)" @mouseleave="hideSubMenu($event)">
                <span>{{item.name}}</span>
                <!-- 二级菜单 -->
                <ul class="sub-menu">
                    <li v-for="subItem in item.sub" @click="doAction(subItem.action,$event)">
                        <span>{{subItem.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "menuBar",
    data: function () {
        return {
            subMenu: {}
        };
    },
    props: {
        "menuData": {
            type: Object,
            required: true
        }
    },
    methods: {
        showSubMenu: function (e) {
            var el = e.currentTarget;
            el.querySelector(".sub-menu").style.display = "block";
        },
        hideSubMenu: function (e) {
            var el = e.currentTarget;
            el.querySelector(".sub-menu").style.display = "none";
        },
        doAction: function (action, e) {
            var el = e.currentTarget;
            el.parentNode.style.display = "none";
            this.$emit("doAction", action);
        }
    }
}
</script>


<style scoped>
.menu {
    overflow: hidden;
    list-style: none;
    cursor: default;
}

.menu>li {
    min-width: 40px;
    float: left;
    text-align: center;
}

.menu li:hover {
    background: #ccc;
}

.sub-menu {
    padding: 3px 0;
    position: absolute;
    background: #f0f0f0;
    /*border: solid 1px #999;*/
    display: none;
}

.sub-menu.on {
    display: block;
}

.sub-menu>li {
    min-width: 100px;
    height: 26px;
    line-height: 26px;
    padding: 0 20px;
    text-align: left;
}
</style>


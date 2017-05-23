<template>
    <div>
        <ul class="menu">
            <li v-for="item in menuData" @mouseenter="showSubMenu(item.key)" @mouseleave="hideSubMenu(item.key)">
                <a href="javascript:;">{{item.name}}</a>
            </li>
        </ul>
        <ul :class="['sub-menu',isShowSubMenu ? 'on':'']">
            <li v-for="item in subMenu">
                <a href="javascript:;">{{item.name}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "menuBar",
    data: function () {
        return {
            isShowSubMenu:false,
            subMenu:{}
        };
    },
    props: {
        "menuData": {
            type: Object,
            required: true
        }
    },
    methods: {
        showSubMenu: function (key) {
            this.subMenu = this.menuData[key].sub;
            this.isShowSubMenu = true;
            console.log(key);
        },
        hideSubMenu: function (key) {
            console.log('hide', key);
            this.isShowSubMenu = false;
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

.menu li {
    min-width: 40px;
    float: left;
    text-align: center;
}

.menu li:hover {
    background: #ccc;
}

.sub-menu {
    position:absolute;
    background: #f0f0f0;
    border: solid 1px #999;
    display: none;
}

.sub-menu.on {
    display: block;
}

.sub-menu li {
    height: 26px;
    line-height: 26px;
    padding: 0 20px;
}
</style>


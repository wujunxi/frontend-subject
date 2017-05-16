<template>
    <div id="app">
        <layer :width="600" :height="600"></layer>
    </div>
</template>

<script>
import Layer from './components/Layer'

export default {
    name: 'myPaint',
    data: function () {
        return {}
    },
    components: {
        Layer
    }
}
</script>

<style>
body {
    background: #333;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    background: url(assets/bg.svg);
    background-size:20px 20px;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
</style>

<<template>
  <div class="color-panel">
    <h3>拾色器</h3>
    <div class="color-table">
        <span v-for="item of colorList" class="color-cell" :style="{background:item}"></span>
    </div>
  </div>
</template>

<<script>
const colorData = (function(){
    let ar = new Array(216),b6;
    for(let i = 0,len = ar.length; i < len; i++){
        b6 = i.toString(6);
        b6 = ('00'+b6).substr(-3);
        ar[i] = '#' + (parseInt(b6[0]) * 3).toString(16);
        ar[i] += (parseInt(b6[1]) * 3).toString(16);
        ar[i] += (parseInt(b6[2]) * 3).toString(16);
        // console.log(ar[i]);
    }
    return ar;
})();

export default {
    name:"color-panel",
    props:[],
    data:function(){
        return {
            colorList:colorData
        };
    },
    methods:{}
}
</script>

<style scoped>
    .color-panel {
        display: block;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        background:#dedede;
    }
    .color-panel h3 {
        background: #fff;
        font-size:14px;
        height:26px;
        line-height: 26px;
        font-weight: normal;
    }

    .color-table {
        overflow: hidden;
        width:300px;
    }

    .color-cell {
        width:20px;
        height:20px;
        float:left;
    }
</style>


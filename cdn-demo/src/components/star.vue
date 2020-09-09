<template>
    <div class="rate" :class="{ 'disabled':disabled }">
        <!-- 显示星星 -->
        <i v-for="i in 5" :key="i" class="iconfont" @mouseenter="disabled?'':curScore=i " @mouseleave="disabled?'':curScore='' "
        @click="disabled ? '' : setScore(i) " :class="getClass(i)">
            <i v-if="disabled&&i==Math.floor(score)+1" class="iconfont" :style="'width:'+width"></i>
        </i>
        <!-- 分数 -->
        <span v-if="showText" class="text">{{ curScore || score }}分</span>
    </div>
</template>

<script type="javascript">
export default {
    data() {
        return {
            curScore: '',     //当前分数
            width: ''
        }
    },
    props: {
        score: {      //分数 ，默认0，保留一位小数
            type: Number,
            default: 0
        },
        disabled: {     //是否只读，默认false，鼠标点击可以打分
            type: Boolean,
            default: false
        },
        showText: {      //是否显示分数，默认true
            type: Boolean,
            default: true
        }
    },
    created() {
        this.getDecimal();
    },
    methods: {
        getClass(i) {
            if(this.curScore === '') {
                return i <= this.score ? 'icon-star':'icon-star-o';
            }else {
                return i <= this.curScore ? 'icon-star':'icon-star-o';
            }
        },
        getDecimal() {
            this.width = Number(this.score * 100 - Math.floor(this.score) * 100) + '%';
        },
        setScore(i) {     // 点击星星评分时通知父组件score得分
            this.$emit('update:score', i);  
        }
    },
}
</script>

<style lang="stylus">
    .rate 
        .iconfont
            display: inline-block;
            position: relative;
            font-size: 10px;

            transition: 0.3s;

            &+.iconfont
                margin-left: 5px;
            .iconfont
                position: absolute;
                left: 0;
                overflow: hidden;
            &.icon-star-o
                color: #c0c4cc;
                font-size: 10px;
            &.icon-star
                color: #f4cd17;
                font-size: 10px;
        &:not(.disabled) .iconfont:hover
            transform: scale(1.2);
            cursor: pointer;
</style>
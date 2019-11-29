<template>
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "ChannelCom",
  // 接收父组件传递的值
  // props: ['cid'],
  props:{
    cid: {
      // type: ,  // 类型
      default:0  // 设置默认值为0
    }
  },
  data() {
    return {
      chid:'',  // 记录当前选中的频道id
      channelList: [] // 频道列表
    };
  },
  created() {
    this.getChannelList(); // 获取频道列表
  },
    watch: {
    // 监听chid数据变化
    chid (newval,oldval) {
      this.$emit('slt', this.chid)
    },
    // 监听父组件传来的值，默认值为0，有变化就赋值给当前页面的chid
    cid (newval,oldval) {
      this.chid = newval
    }
  },
  methods: {
    // 获取频道列表
    getChannelList() {
      let pro = this.$http.get("/channels");
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === "OK") {
            // 数据请求成功将data数据对象展示给channelList
            this.channelList = result.data.data.channels;
          }
        })
        .catch(err => {
          return this.$message.error("错了");
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>

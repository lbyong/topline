<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
        <!-- 
          通过el-upload默认post上传行为
          在计算属性中设置请求头参数通过headers进行设置
          通过name来设置上传图片的参数名称
          on-success方法进行成功后的回调处理
         -->
        <el-upload
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          style="float:right"
          name="image"
          :headers="setToken"
          :on-success="onSuccess"
          :show-file-list="false">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="text item">
        <ul>
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button icon="el-icon-star-off" size="mini" circle></el-button>
              <el-button icon="el-icon-delete" size="mini" circle></el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Material",
  data() {
    return {
      imageList:[],  // 图片列表信息
      // 图片信息参数
      querycdt: {
        collect: false,  // 是否收藏图片
        page:1,  // 页数
        per_page: 20,  // 每页图片个数
      }
    }
  },
  computed: {
    // 获取请求头
    setToken() {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return {Authorization: 'Bearer ' + token}
    }
  },
  created() {
    this.getImageList()
  },
  methods: {
    // 获取图片
    getImageList() {
      let pro = this.$http.get('/user/images', {prarms:this.querycdt})
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            console.log(result)
            this.imageList = result.data.data.results
            // this.$message.success('头像上传成功')
          }
        })
        .catch(err => {
          return this.$message.error('素材获取失败')
        })
    },
    // 上传图片素材成功回调
    onSuccess() {
      // 上传成功提示并重新获取列表
      this.$message.success('上传图片成功')
      this. getImageList()
    }
  },
};
</script>

<style lang="less" scoped>
.box-card {
  box-shadow: none;
  // 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>
      <div class="text item">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px">
          <el-form-item style="width:400px" label="标题" prop="title">
            <el-input v-model="addForm.title" placeholder="文章名称"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="addForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li class="uploadbox" @click="showDialog(item)" v-for="item in covernum" :key="item">
                <span>点击图标选择图片</span>
                <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt="" />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
         <el-form-item label="频道列表:" prop="channel_id">
            <!-- 使用频道列表子组件 -->
            <clannel-com @slt="selectHandler"></clannel-com>
          </el-form-item>
          <el-form-item style="margin-top:50px">
            <el-button type="primary" @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="图片素材"
      :visible.sync="dialogVisible"
      width="60%">
        <ul style="overflow:hidden">
          <li class="image-box" v-for="item in imageList" :key="item.id"  >
            <img :src="item.url" alt   @click="clkImage"/>
          </li>
        </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入频道列表公共子组件
import ClannelCom from '@/components/channel.vue'

// 导入模块
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "ArticleAdd",
  // 注册富文本组件
  components:{
    quillEditor,
    ClannelCom  // 注册频道列表子组件
  },
  data() {
    return {
      dialogVisible: false,  // 对话框默认隐藏
      // channelList:[],  // 频道列表
      addForm:{  // 发布文章
        channel_id:'',  // 频道列表id
        title:'',  // 文章标题
        content:'',  // 文章内容
        cover:{  // 文章封面
          images:[],  // 图片信息
          type:0  // 封面类型   -1:自动，0-无图，1-1张，3-3张
        },
      },
      coverSerial:'',  // 记录封面序号
      materialUrl: '', // 保存图片的src
      imageList:[],  // 图片列表信息
      // 图片信息参数
      querycdt: {
        collect: false,  // 是否收藏图片
        page:1,  // 页数
        per_page: 8,  // 每页图片个数
      },
      // 配置表单校验规则
      addFormRules:{
        title:[
          {required: true, message: '请输入文章标题'},  // 标题为空
          {min: 5, max: 30, message: '标题长度为5-30字符'}  // 标题长度字符限制
        ],
        content:[
          {required: true, message: '请输入文章内容'}  // 内容不能为空
        ],
        channel_id:[
          {required: true, message:'请选择频道'}
        ]
      } 
    }
  },
  // created() {
  //   this.getChannelList() // 获取频道列表
  // },
  computed: {
    // 判断点击的封面类型type值
    covernum() {
      if(this.addForm.cover.type > 0) {
        this.addForm.cover.images = []
        return this.addForm.cover.type
      }
      return 0
    }
  },
  created() {
    this.getImageList()
  },
  methods: {
    // 清除选中图片后的痕迹
    clearImage() {
       // 遍历图片数组
      let lis = document.querySelectorAll('.image-box')
      // 排他思想
      lis.forEach(function(ele) {
        ele.style.border = ''
      }) 
      this.materialUrl = ''  // 清除materialUrl中保存的地址
    },
    // 点击确定按钮把对应url地址素材图片展示出来
    imageOK () {
      // 判断materialUrl是否有数据
      if(this.materialUrl) {
        this.addForm.cover.images[this.coverSerial] = this.materialUrl
        this.dialogVisible = false  // 关闭对话框
      } else {
        this.$message.error('请选择图片素材')
      }
    },
    // 给图片设置选中样式
    clkImage(evt) {
      this.clearImage()
      // 给当前img的父亲元素li设置样式
      evt.target.parentNode.style.border = '1px solid #3a8ee6'
      // 把当前点击图片的url地址赋值给meterialUrl
      this.materialUrl = evt.target.src
    },
    // 获取图片
    getImageList() {
      let pro = this.$http.get('/user/images', {prarms:this.querycdt})
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // console.log(result)
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('素材获取失败')
        })
    },
    // 记录点击图片缩略图的序号弹出对话框
    showDialog(n) {
      this.coverSerial = n-1
      this.dialogVisible = true
      this.clearImage()
    },
    // 给频道子组件设置方法
    selectHandler(val) {
      this.addForm.channel_id = val
    },
    //发布文章
    addarticle(flag) {
      // 校验全部表单元素
      this.$refs.addForm.validate(valid => {
        if(valid) {
          // 发送请求添加数据并跳转页面展示
          // 传入flag参数，true发布成功， flase存入草稿
          let pro = this.$http.post('/articles', this.addForm,{params:{draft: flag}})
          pro.then(result => {
            console.log(this.addForm)
            this.$message.success('文章发布成功')
            this.$router.push('/article')
          }).catch(errar => {
            return this.$message.error('文章发布失败')
          })
        }
      })
    },
    // 获取频道列表
    // getChannelList() {
    //   let pro = this.$http.get("/channels");
    //   pro
    //     .then(result => {
    //       // console.log(result)
    //       if (result.data.message === "OK") {
    //         // 数据请求成功将data数据对象展示给channelList
    //         this.channelList = result.data.data.channels;
    //       }
    //     })
    //     .catch(err => {
    //       return this.$message.error("错了");
    //     });
    // },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  box-shadow: none;
  .el-form /deep/ .ql-editor {  // 进行深度作用选择器
    height: 300px;
  }
  // 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img{
    width: 200px;
    height: 150px;
  }
}
}
.image-box {
  list-style: none;
  width: 200px;
  // height: 200px;
  // background-color: #fff;
  margin: 20px;
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
</style>

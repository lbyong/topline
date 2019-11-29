<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <div class="text item">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
          <el-form-item style="width:400px" label="标题" prop="title">
            <el-input v-model="editForm.title" placeholder="文章名称"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="editForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li class="uploadbox" @click="showDialog(item)" v-for="item in covernum" :key="item">
                <span>点击图标选择图片</span>
                <img v-if="editForm.cover.images[item-1]" :src="editForm.cover.images[item-1]" alt="" />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
         <el-form-item label="频道列表:" prop="channel_id">
            <!-- 使用频道列表子组件 -->
            <clannel-com @slt="selectHandler" :cid="editForm.channel_id"></clannel-com>
          </el-form-item>
          <el-form-item style="margin-top:50px">
            <el-button type="primary" @click="editarticle(true)">修改</el-button>
            <el-button @click="editarticle(false)">草稿</el-button>
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
            <img :src="item.url" alt @click="clkImage" />
          </li>
        </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
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
  name: 'Articleedit',
  // 注册富文本组件
  components: {
    quillEditor,
    ClannelCom // 注册频道列表子组件
  },
  data () {
    return {
      materialUrl: '',  // 记录图片的src信息
      dialogVisible:false,  // 控制对话框显示隐藏
      xu:'',  // 保存封面图下标
      imageList:[],  // 图片列表信息
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      // channelList:[],  // 频道列表
      editForm: { // 修改文章
        channel_id: '', // 频道列表id
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          images: [], // 图片信息
          type: 0 // 封面类型   -1:自动，0-无图，1-1张，3-3张
        }
      },
      // 配置表单校验规则
      editFormRules: {
        title: [
          { required: true, message: '请输入文章标题' }, // 标题为空
          { min: 5, max: 30, message: '标题长度为5-30字符' } // 标题长度字符限制
        ],
        content: [
          { required: true, message: '请输入文章内容' } // 内容不能为空
        ],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      }
    }
  },
  created () {
    // this.getChannelList() // 获取频道列表
    this.getArticleByAid() // 获取指定文章内容
    this.getImageList()
    
  },
  computed: { // 计算属性
    aid () {
      // 通过$route.params获取url中的 id= 参数
      return this.$route.params.id
    },
    // 判断点击的封面类型type值
    covernum() {
      if(this.editForm.cover.type > 0) {
        // this.editForm.cover.images = []
        return this.editForm.cover.type
      }
      return 0
    }
  },
  methods: {
    // 清除选中素材记录
    clearImage() {
      let lis = document.querySelectorAll('li')
      lis.forEach(function(ele) {
        ele.style.border = ''
      })
      this.materialUrl = ''
    },
    // 确定点击事件
     imageOK() {
      // 判断this.materialUrl是否保存了地址信息
      if(this.materialUrl) {
        this.editForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false
      } else {
        this.$message.error('请选择素材')
      }
       
     },
    // 给素材图片设置高亮事件
    clkImage(evt) {
      let lis = document.querySelectorAll('li')
      lis.forEach(function(ele) {
        ele.style.border = ''
      })
      evt.target.parentNode.style.border = '1px solid #3a8ee6'
      // 保存当前图片的src
      this.materialUrl = evt.target.src
    },
    // 给封面设置点击事件
    showDialog(n) {
      this.xu = n-1
      this.dialogVisible = true
      this.clearImage()
    },
    // 给频道子组件设置方法
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    // 通过id获取文章内容
    getArticleByAid () {
      let pro = this.$http.get(`/articles/${this.$route.params.id}`)
      // console.log(pro)
      pro.then(result => {
        this.editForm = result.data.data
        console.log(result)
      }).catch(errar => {
        return this.$message.error('获取文章失败')
      })
    },
    // 修改对应id的文章
    editarticle (flag) {
      // 校验全部表单元素
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 发送请求修改数据并跳转页面展示
          // 传入flag参数，true修改成功， flase存入草稿
          let pro = this.$http.put(`/articles/${this.aid}`, this.editForm, { params: { draft: flag } })
          pro.then(result => {
            this.$message.success('文章修改成功')
            this.$router.push('/article')
          }).catch(errar => {
            return this.$message.error('文章修改失败')
          })
        }
      })
    },
    // 获取素材图片列表
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
            
            
          }
        })
        .catch(err => {
          return this.$message.error('获得素材图片列表错误:' + err)
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
  }
}
</script>

<style lang="less" scoped>
.box-card {
  box-shadow: none;
  .el-form /deep/ .ql-editor {  // 进行深度作用选择器
    height: 300px;
  }
  
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
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor:pointer;
  box-sizing:border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

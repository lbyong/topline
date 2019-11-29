<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号信息</span>
      </div>
      <div class="text item cardbody">
        <div id="left">
          <!-- 设置rules进行表单校验 -->
          <el-form
            ref="accountFormRef"
            :model="accountForm"
            :rules="accountFormRoules"
            label-width="100px"
          >
            <el-form-item label="用户名：" prop="name">
              <el-input v-model="accountForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="mobile">
              <el-input v-model="accountForm.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="accountForm.email"></el-input>
            </el-form-item>
            <el-form-item label="简介：" prop="intro">
              <el-input type="textarea" v-model="accountForm.intro"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editAccount()">更新账户</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="right">
          <el-upload action :show-file-list="false" :http-request="httpRequest">
            <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入bus模块
import bus from '@/utils/bus.js'

export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        id: '', // 用户id
        name: '', // 用户名
        mobile: '', // 手机号
        email: '', // 邮箱
        intro: '', // 简介信息
        photo: '' // 用户头像信息
      },
      // 进行表单校验
      accountFormRoules: {
        name: [
          { required: true, message: '请填写用户名' },
          { min: 1, max: 7, message: '用户名介于1-7个字符长度' }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // 更新用户信息
    editAccount () {
      // patch请求，修改部分信息
      let pro = this.$http.patch('/user/profile', this.accountForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 调用bus在home页面中用$on定义的方法并把更新后的名字传入
            bus.$emit('upAccountName', result.data.data.name)
            this.$message.success('修改信息成功')
          }
        })
        .catch(err => {
          return this.$message.error('修改信息失败')
        })
    },
    // 获取用户个人信息
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // console.log(result);
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取信息错误')
        })
    },
    // 自定义行为上传用户头像
    httpRequest (resource) {
      // 通过FormData进行头像上传
      // resource.file  当前头像的图片信息对象
      // console.log(resource.file)
      let fd = new FormData()
      // 添加图片信息到FormData中
      fd.append('photo', resource.file)
      // 通过请求把fd中的图片数据上传到服务端
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            bus.$emit('upAccountPhoto', result.data.data.photo)
            // console.log(this.accountForm.photo)
            this.$message.success('头像上传成功')
          }
        })
        .catch(err => {
          return this.$message.error('头像上传失败')
        })
    }
    //   handleAvatarSuccess() {

    //   },
    //   // 头像上传成功
    //   handleAvatarSuccess() {
    //     this.$message.success("头像上传成功");
    //   }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  box-shadow: none;
  // .el-form /deep/ .ql-editor {  // 进行深度作用选择器
  //   height: 300px;
  // }
  .cardbody {
    display: flex;
    justify-content: space-between;
    #left {
      margin-top: 20px;
      width: 40%;
      /deep/ textarea {
        height: 100px;
      }
    }
    #right {
      width: 40%;
    }
  }
  //   .avatar-uploader .el-upload {
  //   border: 1px dashed #d9d9d9;
  //   border-radius: 6px;
  //   cursor: pointer;
  //   position: relative;
  //   overflow: hidden;
  // }
  .avatar-uploader-icon:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

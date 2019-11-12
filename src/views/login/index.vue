<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 设置form表单 -->
      <!-- ref  获取el-form使用 -->
      <!-- :model绑定form表单全部数据 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <!-- 设置手机输入框 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号">
            <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
          </el-input>
        </el-form-item>
        <!-- 设置验证码输入框 -->
        <el-form-item prop="code">
          <el-input style="width:60%;float:left" v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
          <el-button plain>发送验证码</el-button>
        </el-form-item>
        <!-- 添加协议 -->
        <el-form-item prop="agr">
          <el-checkbox name="type" v-model="loginForm.agr"></el-checkbox>
          <span class="agr">我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <!-- 添加登录按钮 -->
        <el-form-item>
          <el-button :disabled="isActive" :loading="isActive" style="width:100%" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { error } from "util";

// 引入gt.js文件
import "@/assets/js/gt.js";

export default {
  data() {
    // 在return之前设置自定义验证
    let agrTest = function(rule, value, callback) {
      value ? callback() : callback(new Error("请同意用户协议"));
    };
    return {
      ctaObj: null,  // 创建变量保存极验对象
      isActive:false,  // 按钮状态
      // :model 设置表单数据对象
      loginForm: {
        mobile: "13788887777", // 手机号码
        code: "246810", // 验证码
        agr: true // 协议状态
      },
      // :rules 设置表单验证规则
      loginFormRules: {
        // 设置自然校验字段
        mobile: [
          // 验证手机号
          { required: true, message: "手机号码不能为空" }, // 内容必须填写
          { pattern: /^1[35789]\d{9}$/, message: "手机号格式错误" } // 设置手机号码格式
        ],
        code: [
          // 验证 验证码
          { required: true, message: "验证码不能为空" }
        ],
        // 自定义校验协议
        agr: [{ validator: agrTest }]
      }
    };
  },
  methods: {
    login() {
      // 点击登录跳转首页
      // 表单登录验证方式，当点击登录按钮时，验证form中的所有表单
      this.$refs.loginFormRef.validate(valid => {
        // 判断是否成功
        if (valid) {
          // 判断是否保存成功，保存成功进行调用，并终止函数运行
          if(this.ctaObj !== null) {
            return this.ctaObj.verify()
          }
          this.isActive = true  // 点击登录按钮直接设置等待禁用状态
          // 通过axios.get请求获得秘钥(地址+用户手机号)信息
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`);
          pro
            .then(result => {
              // 成功获取秘钥信息
              //  接收相关秘钥信息 result.data.data
              let { data } = result.data;
              // 调用gt.js中提供的 window.initGeetest() 函数生成验证窗口
              window.initGeetest(
                {
                  // 配置参数
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind'  // 通过登录按钮激活人机验证窗口的方式
                },captchaObj => {
                  captchaObj
                    .onReady(() => {
                      // 验证码ready之后才能调用verify方法显示验证码
                      // 生成验证窗口
                      captchaObj.verify();
                      // 生成的dom极验对象存储给ctaObj保存
                      this.ctaObj = captchaObj
                      this.isActive = false  // 验证窗口弹出后恢复按钮状态
                      // console.log(captchaObj.verify())
                    })
                    .onSuccess(() => {
                      // 验证成功处理,跳转页面
                      this.loginAct(); // 调用账号验证方法进行页面跳转操作
                      this.ctaObj.destroy();  // 跳转页面后销毁极验对象
                    })
                    .onError(() => {
                      // 验证失败处理
                    });
                }
              );
            })
            .catch(err => {
              return this.$message.error("秘钥获取失败");
            });
        }
      });
    },
    // 给服务发送请求验证手机号及验证码是否正确
    loginAct() {
      this.$http
        .post("/authorizations", this.loginForm)
        .then(result => {
          // 请求发送成功页面跳转
          if (result.data.message === "OK") {
            // 将用户数据存储到本地
            window.sessionStorage.setItem(
              "userinfo",
              JSON.stringify(result.data.data)
            );
            // 进行页面跳转
            this.$router.push({ name: "home" });
          }
        })
        .catch(err => {
          // this.$message.error('用户名或密码错误')
          this.$message({
            type: "error",
            message: "用户名或密码错误",
            duration: 1000
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 420px;
    height: 340px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 80%;
      img {
        width: 50%;
        margin: 20px auto;
        display: block;
      }
      button {
        float: right;
      }
      .agr {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>

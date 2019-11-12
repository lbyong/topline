<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <img src="./logo_admin1.png" style="width:40px" v-if="isCollapse"  alt="" />
      <img src="./logo_admin.png"  v-else :class="{show:isCollapse}" alt="" />
      <el-menu
        default-active="1"
        background-color="#323745"
        text-color="#fff"
        active-text-color="#409eff"
        :collapse="isCollapse"
        :style="{'border-right':'1px solid #323745'}"
      >
        <el-menu-item index="1" :style="{width:isCollapse?'65px':'200px',transition:' width 0.5s'}">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px',transition:' width 0.5s'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item style="padding-left:60px" index="2-1">发布文章</el-menu-item>
          <el-menu-item style="padding-left:60px" index="2-2">内容列表</el-menu-item>
          <el-menu-item style="padding-left:60px" index="2-3">评论列表</el-menu-item>
          <el-menu-item style="padding-left:60px" index="2-4">素材管理</el-menu-item>
        </el-submenu>

        <el-menu-item index="3" :style="{width:isCollapse?'65px':'200px',transition:' width 0.5s'}">
          <i class="el-icon-user-solid"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:isCollapse?'65px':'200px',transition:' width 0.5s'}">
          <i class="el-icon-s-tools"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div id="left">
          <i
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            @click="isCollapse = !isCollapse"
            style="cursor:pointer"
          ></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div id="right">
          <el-input placeholder="请输入搜索内容" v-model="searchText">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span>消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <div class="block">
                <el-avatar :size="50" :src="photo"></el-avatar>
                {{name}}
              </div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item divided @click.native="out()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
          <!-- 给子组件配置占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false, // 控制左侧折叠效果   false展开
      searchText:''  // 设置搜索框内容
    };
  },
  // 通过计算属性获取本地存储的数据（手机号 + 头像）
  computed: {
    name() {
      return JSON.parse(window.sessionStorage.getItem("userinfo")).name;
    },
    photo() {
      return JSON.parse(window.sessionStorage.getItem("userinfo")).photo;
    }
  },
  methods: {
    out() {
      // 点击退出
      this.$confirm("是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.sessionStorage.clear();
          this.$router.push("/login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
  .el-menu-item:hover{
  background-color: #409eff;
}
.el-container {
  height: 100%;
  .show{
    opacity: 0;
    // display: none;
  }
  .el-aside {
    overflow: hidden;
    background-color: #323745;
    height: 100%;
    transition: width 0.5s;
    // position: relative;
    img {
        // position: absolute;
      display: block;
      margin: 0 auto;
      // width: 140px;
      height: 36px;
      padding: 20px 0;
    }
  }
  .el-header {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    min-width: 950px;
    #left {
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      i {
        font-size: 26px;
        margin-right: 10px;
      }
    }
    #right {
      width: 60%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-input {
        width: 300px;
        margin-right: 20px;
      }
      .el-dropdown-link {
        display: flex;
        align-items: center;
        cursor:pointer;
        .block {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 10px;
        }
      }
    }
    
  }
  .el-main {
    background: #f2f3f5;
  }
}
</style>

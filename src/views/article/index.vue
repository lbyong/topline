<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>最新图文</span>
      </div>
      <div class="text item">
        <!-- 插入表单组件 :ref表单组件对象  :model表单数据对象   -->
        <el-form :model="searchForm" label-width="100px">
          <el-form-item label="文章状态:">
            <!-- v-model设置双向数据绑定， label设置当前按钮的value值 -->
            <el-radio-group  v-model="searchForm.status" @change="getArticleList()">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表:">
            <!-- 使用频道列表子组件 -->
            <clannel-com @slt="selectHandler"></clannel-com>
          </el-form-item>
          <el-form-item label="时间选择:">
            <!-- <div class="block"> -->
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <!-- </div> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>共找到{{total_count}}条符合条件的内容</span>
      </div>
      <div class="text item">
        <!-- 通过 :data绑定articleList数组对象，prop接收对象的值 -->
        <el-table :data="articleList" style="width: 100%">
          <el-table-column label="图片" width="200px" >
            <!-- 需要给img标签设置作用域插槽 ，通过slot-scope插槽属性定义对象接收数据 -->
            <img :src="stData.row.cover.images[0]" style="overflow:hidden" height="100px" width="100px" alt="" slot-scope="stData">
            <!-- <el-image lazy style="width: 100px; height: 100px" :src="stData.row.cover.images[0]" slot-scope="stData"></el-image> -->
          </el-table-column>
          <el-table-column prop="title" label="标题" width="400px" ></el-table-column>
          <el-table-column label="状态" width="400px">
            <!-- 作用域插槽 获取文章状态 -->
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0" type="info">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" >审核通过</el-tag>
              <el-tag v-else type="info">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间" width="400px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <!-- 点击修改按钮通过id值跳转对应修改页面 -->
              <el-button size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)"><i class="el-icon-edit"></i>修改</el-button>
            <el-button size="mini" @click="delarticle(stData.row.id)"><i class="el-icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 设置分页功能 -->
        <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-size="searchForm.per_page"
        background
        layout="prev, pager, next"
        :total="total_count"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>

// 引入频道列表公共子组件
import ClannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleList',
  // 注册富文本组件
  components: {
    ClannelCom // 注册频道列表子组件
  },
  data () {
    return {
      total_count: 0, // 记录全部条数
      articleList: [], // 文章列表
      timetotime: [], // 时间表单域，接收开始时间和结束时间
      channelList: [
        // 设置频道列表数据
        // { id: 1, name: "前端开发真" },
      ],
      searchForm: {
        // form表单数据对象
        status: '', // 文章状态
        channel_id: '', // 频道列表id
        begin_pubdate: '', // 起始时间
        end_pubdate: '', // 结束时间
        page: 1, // 页码
        per_page: 10 // 每页条数
      }
    }
  },
  // 设置监听器，监听文章时间选择内容变化
  watch: {
    timetotime (newval) {
      // 监听时间选择表单的新值
      // 如果有值把内容拆分给begin_pubdate和end_pubdate
      if (newval) {
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      };
      // 根据时间范围重新获取文章列表
      this.getArticleList()
    },
    // 对searchForm进行深度监听，内部值有变化就重新获取文章列表
    searchForm: {
      handler: function (newval) {
        this.getArticleList()
      },
      deep: true
    }
  },
  // 设置生命周期
  created () {
    // 调用频道列表函数进行数据展示
    // this.getChannelList();
    this.getArticleList()
  },
  methods: {
    // 给频道子组件设置方法
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    // 通过id删除文章
    delarticle (id) {
      let pro = this.$http.delete(`/articles/${id}`)
      pro.then(result => {
        this.$confirm('是否删除文章', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$messag.success('文章删除成功')
          this.getArticleList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }).catch(errar => {
        return this.$message.error('文章删除失败')
      })
    },
    // 添加翻页事件
    handleCurrentChange (val) {
      // console.log(val)
      this.searchForm.page = val
      // console.log(this.searchForm.page)
      this.getArticleList()
    },
    // 获取文章列表
    getArticleList () {
      // 对文章列表数据进行条件优化
      let searchData = {} // 创建新对象，将有数据的放进新对象中
      for (var i in this.searchForm) { // 遍历searchForm对象
        // 判断成员是否为空
        // console.log(this.searchForm)
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
          // console.log(searchData[key])
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === 'OK') {
            // 数据请求成功将data数据对象展示给articleList
            this.articleList = result.data.data.results
            // 把data数据中的总条数取出来
            this.total_count = result.data.data.total_count
            // console.log(this.total_count)
          }
        })
        .catch(err => {
          return this.$message.error('获取文章列表错误')
        })
    },
    // 获取频道列表数据展示
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === 'OK') {
            // 数据请求成功将data数据对象展示给channelList
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('错了')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  box-shadow: none;

}
.el-pagination {
   display: flex;
  justify-content: center;
  margin: 40px 0;
}
</style>

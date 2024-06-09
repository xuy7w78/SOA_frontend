<template>
  <div class="user-profile">
    <div class="user-info">
         
      <div v-html="user.avatar" class="user-avatar"></div>
      <!-- <div class="user-name">
        <p>{{user.uname}}</p>
      </div> -->
      <div class="user-discription">
        <!--字体左对齐且行距为1.5倍-->
        <p style="text-align: left; line-height: 1.5">{{user.discription}}</p>
      </div>
      <div class="user-tags">
        <span v-for="(tag, index) in user.tags.slice(0, 15)" :key="index">{{ tag }}</span>
        <!-- 使用slice(0, 15)确保最多只显示15个标签 -->
      </div>
    </div>
    <div class="user-skills">
      <div ref="chart" style="width: 100%; height: 100%;" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getCurrentInstance} from 'vue'
import {ElMessage} from "element-plus"

// import RadarChart from './RadarChart.vue';

import multiavatar from '@multiavatar/multiavatar'
export default {
  components: {
    // RadarChart
  },
  data() {
    return {
      user: {
        avatar: '',
        uname: '',
        discription: '',
        tags: [],
        skills: [
          { axis: '细节', value: 1},
          { axis: '理解', value: 2},
          { axis: '应用', value: 3},
          { axis: '总结', value: 4}
        ]
      }
    };
  },
  async created() {
    const {proxy} = getCurrentInstance()
    const url = proxy.$urls.names().get_profile
    const ret = await new proxy.$request(url).myGET()
    

    if(ret.success) {
      // console.log('获取用户信息成功')
      // console.log(ret)
      this.user = {
        avatar: multiavatar(ret.username),
        uname: ret.username,
        tags: ret.labels,
        discription: ret.description,
        skills: [
          { axis: '细节', value: ret.average_score.tf},
          { axis: '理解', value: ret.average_score.choice},
          { axis: '应用', value: ret.average_score.blank},
          { axis: '总结', value: ret.average_score.review}
        ]
      }
      const chart = echarts.init(this.$refs.chart);

      chart.setOption({
        radar: {
          indicator: this.user.skills.map(item => ({ name: item.axis, max: 100 }))
        },
        series: [{
          type: 'radar',
          data: [this.user.skills.map(item => item.value)],
        }],
      });
      chart.resize({
        width: 400,
        height: 400
      })
    } else {
      ElMessage({
        message: '获取用户信息失败',
        type: 'warning',
      })
      this.user = {
      avatar: multiavatar('John Doe'),
      uname: 'John Doe',
      discription: 'This is a user profile',
      tags: ['Designer', 'Developer', 'Photographer', 'Designer', 'Developer', 'Photographer', 'Designer', 'Developer', 'Photographer'],
      skills: [
        { axis: 'JavaScript', value: 0.8 },
        { axis: 'CSS', value: 0.7 },
        { axis: 'HTML', value: 0.9 },
        { axis: 'Node.js', value: 0.6 },
        { axis: 'Vue.js', value: 0.8 },
      ]
    }
    }
    
  }
};
</script>

<style scoped>
.user-profile {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-left: 20px;
}
.user-info {
  width: 50%;
  height: 60%;
}
.user-tags span {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px; /* 添加这行代码以在标签之间添加垂直间距 */
  padding: 5px 10px; /* 添加这行代码以在标签内部添加一些空间 */
  border: 1px solid; /* 添加这行代码以给标签添加边框 */
  border-radius: 5px; /* 添加这行代码以给标签添加圆角 */
  word-break: break-all; /* 添加这行代码以允许长标签换行 */
  /*背景透明，文字不透明*/
  background-color: rgba(147, 245, 134, 0.5);
  color: #000;
  opacity: 0.6;
}
.user-skills {
  width: 45%;
}

.user-avatar {
  width:50%;
  margin-left: 25%;
  background-position: center;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>

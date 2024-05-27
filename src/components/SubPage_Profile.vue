<template>
  <div class="user-profile">
    <div class="user-info">
      
      <div v-html="user.avatar" class="user-avatar"></div>
      <h2>{{ user.name }}</h2>
      <div class="user-tags">
        <span v-for="(tag, index) in user.tags.slice(0, 15)" :key="index">{{ tag }}</span>
        <!-- 使用slice(0, 15)确保最多只显示15个标签 -->
      </div>
    </div>
    <div class="user-skills">
      <radar-chart :data="user.skills"></radar-chart>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import RadarChart from './RadarChart.vue';

import multiavatar from '@multiavatar/multiavatar'
export default {
  components: {
    RadarChart
  },
  data() {
    return {
      user: {
        avatar: '',
        name: '',
        tags: [],
        skills: []
      }
    };
  },
  async created() {
    // const response = await axios.get('https://api.example.com/user');
    // this.user = response.data
    this.user = {
      avatar: multiavatar('John Doe'),
      name: 'John Doe',
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
};
</script>

<style scoped>
.user-profile {
  display: flex;
  justify-content: space-between;
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
  width: 50%;
}

.user-avatar {
  width:50%;
  margin-left: 25%;
  background-position: center;
}
</style>

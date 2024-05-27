<template>
    <div class="main_con">
        <div style="text-align: left;">
            <H2>施工日志</H2>
            <el-divider></el-divider>
        </div>
 
        <el-calendar>
            <template>  <div>    <slot name="data"></slot>  </div></template>

            <template v-slot:data>
                {{ data.day.split('-').slice(1).join('-') }}
                <div style="width:100%;" v-for="item in scheduleData" :key="item">
                    <el-tag type="danger" v-if="(item.workingDay).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                        {{item.content}}
                    </el-tag>
                </div>
            </template>
        </el-calendar>
    </div>
</template>
 
<script>
export default {
    name: "PatrolSchedule",
    components: {},
    data() {
        return {
            value: new Date(),
            scheduleData: [
                {
                    workingDay: "02",
                    content: "土方开挖",
                },
                {
                    workingDay: "03",
                    content: "地基验坑",
                },
                {
                    workingDay: "04",
                    content: "地基回填",
                },
                {
                    workingDay: "05",
                    content: "基础垫层模",
                },
                {
                    workingDay: "06",
                    content: "基础垫层混凝土浇筑",
                },
                {
                    workingDay: "07",
                    content: "基础钢筋绑扎",
                },
            ],
        };
    },
    mounted() {},
    methods: {},
};
</script>
<style scoped>
/deep/.el-calendar-day {
    box-sizing: border-box;
    padding: 5px;
    height: 80px;
}
</style>
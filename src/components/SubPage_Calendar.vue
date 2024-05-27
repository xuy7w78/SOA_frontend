<template>
  <ActivityCalendar
    :data="data"
    :width="40"
    :height="7"
    :cellLength="20"
    :cellInterval="10"
    :colors="colors"
    :cellBorderRadius="4" 
    :fontSize="12"
    :showLevelFlag="false"
  />
</template>
<script>
export default {
    data() {
        return {
            data: [
                {
                date: "2024-01-01",
                count: 100
                },
                {
                date: "2024-01-02",
                count: 120
                },

            ]
        }
    }
}
</script>

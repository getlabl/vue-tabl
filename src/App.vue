<template>
  <h2>
    Table 1
  </h2>
  <MyTable :data="tableData"></MyTable>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import MyTable from './components/MyTable.vue'

export default defineComponent({
  name: 'App',
  components: {
    MyTable,
  },
  setup() {
    // use case 1
    const tableData = reactive([
      ['', 'Height', 'Burst'],
      ['S', '156-160', '74-90'],
      ['М', '159-164', '88-96'],
    ])

    return { tableData }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

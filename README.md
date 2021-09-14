**Simple editable table for Vue**

## Example

```html
<template>
  <VueTabl :data="tableData" />
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import VueTabl from 'vue-tabl'

  const tableData = reactive([
    ['Apple', 'Banana', 'Strawberry'],
    ['Orange', 'Melon', ''],
  ])
</script>
```

## Customization

You can use CSS variables to customize look of the table.

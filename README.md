Simple editable table for Vue

Component directly edits 2-dimensional array of strings

## Example

```html
<template>
  <VueTabl :data="tableData" />
</template>

<script setup>
  import { reactive } from 'vue'
  import VueTabl from 'vue-tabl'

  const tableData = reactive([
    ['Apple', 'Banana', 'Strawberry'],
    ['Orange', 'Melon', ''],
  ])
</script>
```

### Live: https://getlabl.github.io/vue-tabl/

## Options

You can pass options with a prop:

```html
<VueTabl :data="tableData" :options="optionsObject" />
```

Possible table options:

- isFirstRowFixed - boolean, if true make first row fixed
- isFirstColumnFixed - boolean, if true make first column fixed

Example options object:

```js
const options = {
  isFirstRowFixed: true,
  isFirstColumnFixed: false,
}
```

## Events

- cell-input - payload: rowIndex, columnIndex, value, emits on input in any cell

## Customization

You can use CSS variables to customize look of the table.

- **--tabl-radius** - table corner radius
- **--tabl-button-radius** - table add and remove button corner radius
- **--tabl-border-color** - table cell border color
- **--tabl-line-hover-color** - background color of hovered row and column
- **--tabl-cell-hover-color** - background color of hovered cell
- **--tabl-remove-hover-color** - removing row or column highlight color
- **--tabl-accent-color** - accent color, used for add button and insertion highlighting
- **--tabl-danger-color** - danger color, used for delete button
- **--tabl-text-color** - text color
- **--tabl-contrast-color** - contrast to text color

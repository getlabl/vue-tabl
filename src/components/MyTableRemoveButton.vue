<template>
  <button class="my-table-remove-button">
    <svg
      class="my-table-remove-button__icon"
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.17736 5.07031C9.17736 9.84258 9.8206 11.9997 5.49415 11.9997C1.16716 11.9997 1.82367 9.84258 1.82367 5.07031"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M10 3.24237H1" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M7.40873 3.24104C7.40873 3.24104 7.70328 1 5.49972 1C3.29669 1 3.59124 3.24104 3.59124 3.24104"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
$danger-color: var(--my-table-danger-color, var(--my-table-danger-color-default));
$contrast-color: var(--my-table-contrast-color, var(--my-table-contrast-color-default));
$radius: var(--my-table-button-radius, var(--my-table-button-radius-default));

.my-table-remove-button {
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  padding: 0;
  border: 1px solid $danger-color;
  background-color: $contrast-color;
  border-radius: $radius;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s, fill 0.2s;

  &:hover {
    background-color: $danger-color;

    .my-table-remove-button__icon {
      stroke: $contrast-color;
    }
  }
}

.my-table-remove-button__icon {
  stroke: $danger-color;
}
</style>

<template>
  <button class="my-table-add-button">
    <svg
      class="my-table-add-button__icon"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.5 0C5.22386 0 5 0.223858 5 0.5V5H0.5C0.223858 5 0 5.22386 0 5.5C0 5.77614 0.223858 6 0.5 6H5V10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5V6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H6V0.5C6 0.223858 5.77614 0 5.5 0Z"
      />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
$accent-color: var(--my-table-accent-color, var(--my-table-accent-color-default));
$contrast-color: var(--my-table-contrast-color, var(--my-table-contrast-color-default));
$radius: var(--my-table-button-radius, var(--my-table-button-radius-default));

.my-table-add-button {
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  padding: 0;
  border: 1px solid $accent-color;
  background-color: $contrast-color;
  border-radius: $radius;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s, fill 0.2s;

  &:hover {
    background-color: $accent-color;

    .my-table-add-button__icon {
      fill: $contrast-color;
    }
  }
}

.my-table-add-button__icon {
  fill: $accent-color;
}
</style>

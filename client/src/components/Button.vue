<template>
  <div class="button">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.button {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  background: hsl(121, 43%, 54%);
  color: hsl(0, 0%, 100%);
  cursor: pointer;
}
</style>

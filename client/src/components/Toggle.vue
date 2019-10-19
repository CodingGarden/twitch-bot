<template>
  <div class="toggle" @click="$emit('clicked')" :class="{ 'toggle-checked': checked }">
    <div class="toggle-thumb"></div>
  </div>
</template>

<script>
export default {
  props: ['checked'],
};
</script>

<style lang="scss" scoped>
.toggle {
  --height: 24px;
  width: calc(var(--height) * 2);
  display: inline-block;
  background: hsl(0, 0%, 18%);
  border-radius: calc(var(--height) * 0.5);
  cursor: pointer;

  &-thumb {
    width: var(--height);
    height: var(--height);
    background: transparent;
    box-sizing: border-box;
    border: 3px solid hsl(0, 0%, 28%);
    border-radius: 50%;
    transition: 150ms transform, 100ms background;
  }
  &.toggle-checked .toggle-thumb {
    border: 0;
    background: hsl(121, 43%, 54%);
    transform: translateX(var(--height));
  }
}
</style>

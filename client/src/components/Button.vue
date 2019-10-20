<template>
  <button
    :disabled="disabled"
    :type="type"
    class="button"
    :class="{
      [color]: !!color,
      disabled: disabled,
    }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: ['type', 'color', 'disabled'],
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.button {
  display: inline-block;
  font-family: inherit;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 4px;
  background: $codingGardenGreen;
  color: hsl(0, 0%, 100%);
  cursor: pointer;
  border: 0;
  user-select: none;
}
.button.red {
  background: $red;
}
.button.orange {
  background: $orange;
}
.button.yellow {
  background: $yellow;
  color: $black;
}
.button.green {
  background: $codingGardenGreen;
}
.button.blue {
  background: $blue;
}
.button.disabled {
  background: grey;
  cursor: not-allowed;
}
</style>

<template>
  <div class="command-form">
    <p class="error" v-if="error">{{error}}</p>
    <form @submit.prevent="$emit('onSubmit', newCommand)">
      <label>
        <div>Name</div>
        <input type="text" name="name" id="name" v-model="newCommand.name" required />
      </label>
      <label>
        <div>Required Role</div>
        <div class="select-element">
          <select name="required-role" id="required-role" v-model="newCommand.requiredRole" required>
            <!-- TODO: get roles from API -->
            <option v-for="role in roles" :key="role" :value="role">{{role}}</option>
          </select>
        </div>
      </label>
      <label>
        <div>Reply Text</div>
        <input type="text" name="reply-text" id="reply-text" v-model="newCommand.replyText" required />
      </label>
      <Button type="submit" :disabled="!newCommand.name || !newCommand.replyText">
        Submit
      </Button>
    </form>
  </div>
</template>

<script>
import Button from './Button.vue';

export default {
  props: ['error'],
  components: {
    Button,
  },
  mounted() {
    this.$emit('resetForm', this.reset);
    this.reset();
  },
  methods: {
    reset() {
      this.newCommand = {
        name: '',
        replyText: '',
        requiredRole: 'viewer',
        // TODO: add aliases...
        aliases: [],
      };
    },
  },
  data() {
    return {
      roles: ['viewer', 'moderator', 'manager', 'broadcaster'],
      newCommand: {},
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

form {
  display: flex;
  margin-bottom: 8px;
  align-content: center;

  label {
    .select-element {
      position: relative;

      &:after {
        content: '▼';
        color: $black;
        position: absolute;
        top: 50%;
        // bottom: 0;
        right: 4px;
        pointer-events: none;
        transform: translateY(-50%);
      }
    }
  }
  Button {
    align-self: flex-end;
  }
}

.command-form {
  background: hsl(0, 0%, 16%);
  padding: 8px 16px;
  border-radius: 8px;
  opacity: 1;
  transition: 500ms;
  margin: 16px 0;
  overflow: hidden;
  max-height: 120px;
  position: relative;

  &.hide-form {
    pointer-events: none;
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
  }
  &.adding-command {
    pointer-events: none;

    &:before {
      content: 'Adding Command...';
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: hsla(0, 0%, 100%, 0.5);
      color: $black;
    }
  }
}
</style>

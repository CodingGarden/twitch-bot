<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p v-if="!channel">Loading...</p>
    <div v-else>
      <p>Welcome!</p>
      <p v-if="channel.enabled">Pruner Bot is enabled for your channel</p>
      <p v-else>Pruner Bot is <strong>not</strong> enabled for your channel</p>
      <Toggle :checked="channel.enabled" @clicked="toggleChannel"></Toggle>
      <div class="commands-list-header">
        <h2>Commands:</h2>
        <Button color="yellow" @click.native="commandFormToggle = !commandFormToggle">
          Add Command
        </Button>
      </div>
      <CommandForm
        v-on:onSubmit="addCommand"
        v-on:resetForm="setResetForm"
        :class="{
          'hide-form': !commandFormToggle,
          'adding-command': addingCommand
        }"
        :error="addCommandErrorMessage"
        :aria-hidden="!commandFormToggle"
      />
      <transition-group name="command" tag="div" class="command-list">
        <div class="command command-item" v-for="command in reversedCommands" :key="command._id">
          <div class="command-name">
            {{command.name}}
            <div class="command-role">{{command.requiredRole}}</div>
          </div>
          <div class="command-reply-text">
            <div class="command-part">Reply:</div>
            <div>{{command.replyText}}</div>
          </div>
          <div class="command-aliases">{{command.aliases.join(', ')}}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import * as api from '../lib/api';
import Button from '../components/Button.vue';
import Toggle from '../components/Toggle.vue';
import CommandForm from '../components/CommandForm.vue';

export default {
  components: {
    Button,
    Toggle,
    CommandForm,
  },
  data: () => ({
    channel: null,
    updatingChannel: false,
    commands: [],
    commandFormToggle: false,
    addingCommand: false,
    addCommandErrorMessage: '',
  }),
  computed: {
    reversedCommands() {
      return this.commands.slice().reverse();
    },
  },
  async created() {
    const user = api.getUser();
    if (!user) return this.$router.push('/');
    try {
      const [channel, commands] = await Promise.all([
        api.getChannel(),
        api.listCommands(),
      ]);
      this.channel = channel;
      this.commands = commands;
    } catch (error) {
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  },
  methods: {
    async toggleChannel() {
      if (this.updatingChannel) {
        return;
      }
      this.updatingChannel = true;
      const channel = await api.updateChannel({
        enabled: !this.channel.enabled,
      });
      console.log(channel);
      this.channel = channel;
      this.updatingChannel = false;
    },
    async addCommand(newCommand) {
      this.addingCommand = true;
      try {
        const command = await api.addCommand(newCommand);
        this.commands.push(command);
        this.commandFormToggle = false;
        this.resetForm();
        this.addCommandErrorMessage = '';
      } catch (error) {
        this.addCommandErrorMessage = error.response.data.message;
      }
      this.addingCommand = false;
    },
    setResetForm(resetForm) {
      this.resetForm = resetForm;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.dashboard {
  width: 80%;
  margin: 0 auto;
}

.commands-list-header {
  display: flex;
  justify-content: space-between;

  Button {
    align-self: flex-end;
  }
}

// TODO: animate commands being added
.command-list {
  margin-bottom: 16px;

  &:empty:before {
    content: 'You have not added any commands, try to adding a command!';
  }
}

.command {
  background: hsl(0, 0, 15%);
  border-radius: 8px;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'name role'
    'text text';

  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &-name,
  &-reply-text {
    padding: 8px;
  }
  &-name {
    font-size: 1.5em;
    font-weight: bold;
    grid-area: name;
    display: flex;
    align-items: center;
  }
  &-reply-text {
    grid-area: text;

    small {
      margin-bottom: 8px;
    }
  }
  &-part {
    margin-bottom: 4px;
  }
  &-role {
    display: inline-block;
    border-radius: 12px;
    font-size: 0.6em;
    // TODO: change color based on role
    background: $codingGardenGreen;
    padding: 4px 8px;
    grid-area: role;
    margin-left: 8px;
  }
  &-aliases {
    font-size: 0.9em;
  }
}

.command-enter-active, .command-leave-active {
  transition: all 500ms;
}
.command-enter, .command-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
</style>

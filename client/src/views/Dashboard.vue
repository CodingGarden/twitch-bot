<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p v-if="!channel">Loading...</p>
    <div v-else>
      <p>Welcome!</p>
      <p v-if="channel.enabled">Pruner Bot is enabled for your channel</p>
      <p v-else>Pruner Bot is <strong>not</strong> enabled for your channel</p>
      <Toggle :checked="channel.enabled" @clicked="toggleChannel"></Toggle>
    </div>
  </div>
</template>

<script>
import * as api from '../lib/api';
import Toggle from '../components/Toggle.vue';

export default {
  components: {
    Toggle,
  },
  data: () => ({
    channel: null,
    updatingChannel: false,
  }),
  async created() {
    const channel = await api.getChannel();
    this.channel = channel;
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
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 80%;
  margin: 0 auto;
}
</style>

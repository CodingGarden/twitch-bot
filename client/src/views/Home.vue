<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">A Twitch Bot</h1>
      <div class="hero-desc">A multi-channel bot. You need this in your life.</div>
      <div class="hero-button">
        <Button @click.native="loginWithTwitch">
          Login with Twitch
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../components/Button.vue';
import API_URL from '../API_URL';

export default {
  components: {
    Button,
  },
  created() {
    if (localStorage.token) {
      return this.$router.push({ name: 'dashboard' });
    }
    this.handleMessage = (event) => {
      if (event.origin !== API_URL) {
        return;
      }
      if (event.data.token) {
        localStorage.token = event.data.token;
        this.$router.push({ name: 'dashboard' });
      }
    };
    window.addEventListener('message', this.handleMessage);
  },
  destroyed() {
    window.removeEventListener('message', this.handleMessage);
  },
  methods: {
    loginWithTwitch() {
      const h = 540;
      const w = 360;
      const left = (window.screen.width / 2) - (w / 2);
      const top = (window.screen.height / 2) - (h / 2);
      window.open(
        `${API_URL}/auth/twitch?`,
        'Login with Twitch',
        `width=${w},height=${h},top=${top},left=${left}`,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    justify-content: center;
  }
  .hero {
    padding: 3em;
    background: hsl(0, 0%, 18%);
    display: flex;
    flex-direction: column;
    margin-top: 2em;

    &-title {
      font-size: 4em;
    }
    &-desc {
      font-size: 2em;
      margin-bottom: 1em;
    }
    &-button {
      align-self: center;
    }
  }
</style>

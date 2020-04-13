<template>
  <div class="v-btn px-4"><v-icon left>mdi-clock</v-icon>{{ formattedTime }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { formattedTime } from '@/utils/formatTime'

export default Vue.extend({
  props: {
    duration: String,
    startTime: Number
  },
  data() {
    return {
      timePassed: 0 as number,
      timerInterval: null as any,
    };
  },

  computed: {
    timerLength() {
      const [minutesStr, secondsStr] = this.duration.split(':')
      const minutes = parseInt(minutesStr)
      const seconds = parseInt(secondsStr)
      if (isNaN(minutes) || isNaN(seconds)) {
        return 0
      }
      return minutes * 60 + seconds
    },

    timeLeft(): number {
      return this.timerLength - this.timePassed
    },

    formattedTime(): string {
      return formattedTime(this.timeLeft)
    }
  },

  methods: {
    start() {
      if (this.timerInterval) {
        throw new Error('Timer already running')
      }
      this.timerInterval = setInterval(() => {
        this.timePassed += 1
        if (this.timePassed === this.timerLength) {
          this.$emit('timeout')
        }
      }, 1000);
    },

    pause() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    stop() {
      this.pause()
      this.timePassed = 0;
    }
  },

  watch: {
    startTime: {
      immediate: true,
      handler(newStartTime) {
        if (!newStartTime) {
          if (this.timerInterval) {
            this.stop()
          }
          return;
        }
        const currentTime = Math.round(new Date().getTime() / 1000) 
        this.timePassed = Math.min(currentTime - newStartTime, this.timerLength)

        if (this.timePassed < this.timerLength && !this.timerInterval) {
          this.start()
        } else if (this.timePassed >= this.timerLength && this.timerInterval) {
          this.pause()
        }
      }
    }
  }
})
</script>
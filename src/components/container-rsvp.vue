<template>
  <div>
  <template>
  <div class="container-rsvp">
    <slot name="dash-rsvp"></slot>
    <slot name="develop-rsvp"></slot>
  </div>
</template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component({
  name: 'container-rsvp',
  components: {
  },
})
export default class extends Vue {}
</script>


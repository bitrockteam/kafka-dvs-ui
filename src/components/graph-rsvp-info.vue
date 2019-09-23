<template>
<div>
  <graph-chart />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GraphChart from '@/components/graph-chart.vue';

@Component({
  name: 'graph-rsvp-info',
   components: {
    GraphChart,
  },
})
export default class extends Vue {
  private startdate: string = '';
  private starttime: string = '';
  private locale: string = 'en-EN';

  private mounted() {
    const date = new Date();
    this.startdate = new Intl.DateTimeFormat(this.locale).format(date);
    this.starttime = date.toLocaleTimeString();
  }
}
</script>

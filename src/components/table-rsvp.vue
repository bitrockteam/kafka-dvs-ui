<template>
  <section class="table" >
    <h5>Stream KSQL</h5>
    <div class="tableFix">
      <table v-if="data.length > 0">
        <thead>
          <tr>
            <th>Event name</th>
            <th>Group</th>
            <th>City</th>
            <th class="response">Response</th>
            <!-- <th>Date</th> -->
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(event, index) in data"
            :key="index"
          >
            <td>{{ event.eventname }}</td>
            <td>{{ event.group.name }}</td>
            <td>{{ event.group.city }}</td>
            <td class="response">{{ event.response }}</td>
            <!-- <td>{{ formatDate(event.timestamp) }}</td> -->
            <td>{{ event.user.name }}</td>
          </tr>  
        </tbody>
      </table>
      <div class="else-ksql" v-else>
        <div>STREAM {{ lastID()}}</div>
        <div v-if="requesting"><amber-progress/></div>
      </div>  
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import LoadingMap from '@/components/loading-map.vue';
import '@amber-ds/components/progress';
import { Topic } from '@/interfaces/dashboard';

@Component({
  name: 'table-rsvp',
  components: {
  },
  computed: {
    data() {
      return this.$attrs.data || [];
    },
  },
})



export default class TableRsvp extends Vue {
  @Getter private requesting!: boolean;
  @Getter private getSessions!: string[];

  private formatDate(date: Date): string {
    const locale: string = 'en-EN';
    return new Intl.DateTimeFormat(locale).format(date);
  }

  private lastID() {
    return this.getSessions.slice().pop();
  }
}


</script>

<style lang="scss" scoped src="@/styles/components/table-rsvp.scss">

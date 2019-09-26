<template>
  <div class="list-rsvp-user">
    <h5>{{ titlesection }}</h5>
    <div>
      <div class="list-user">
        <div class="user-info">
          <span class="user-rsvp">{{ CountAirline }}</span>
          <span>answered <span class="user-response">{{ CountFlightStatus }}</span> to</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { RSVPEvent } from '@/interfaces/map.ts';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import LoadingPlaceholderList from '@/components/loading-placeholder-list.vue';
import IconSubject from '@/components/icon-subject.vue';
import IconList from '@/components/icon-list.vue';

@Component({
  name: 'live-traffic',
  components: {
    IconSubject,
    IconList,
    LoadingPlaceholderList,
  },
})
export default class extends DashboardWidget {
  private titlesection = 'Live traffic information';
  private CountAirline: Number = 0;
  private CountFlightStatus: Number = 0;

  private manageLiveTrafficInfo(event: RSVPEvent, i: number) {
    const { eventType, eventPayload: { eventCount } } = event;
    this[eventType] = eventCount;
  }

  private mounted() {
    const url = streamWS('totalElementsChanged');
    this.socket = webSocket(url);
    this.socket.pipe(
      map(this.manageLiveTrafficInfo),
    ).subscribe();
  }

}
</script>

<style lang="scss" scoped src="@/styles/components/list-user.scss" />

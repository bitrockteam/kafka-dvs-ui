<template>
  <div>
    
    <!-- data -->
    <div class="list-rsvp-user" v-if="data.length > 0"> 
      <div class="change-view" >
        <h5>{{ titlesection }}</h5> 
          <div>
            <span >
              <button class="btn"
                aria-label="Show widget"
                v-on:click="toggleWidget()" 
                v-bind:class="isSelected(displayWidget, true)"
              >
                <icon-list />
              </button>
            </span>
            <span>
              <button class="btn"
                aria-label="Show KSQL query"
                v-on:click="toggleWidget()" 
                v-bind:class="isSelected(displayWidget, false)"
              >
                <icon-subject />
              </button>
            </span>
        </div>
      </div>
      
      <!-- showTrend -->
      <div v-if="displayWidget">        
        <div 
          class="list-user" 
          v-for="(event, index) in data"
          :key="index"
        >
          <div class="user-info">
            <span class="user-rsvp">{{ event.user.name }}</span>
            <span>answered <span class="user-response">{{ event.response }}</span> to</span>
          </div>
          <span class="event-rsvp"> {{ event.group.name }}</span>
        </div>
      </div>

      <!-- showRsvp -->
      <div class="query" v-else>
        <ksql-query-text
          :text="queryText"
        />
      </div>        
    </div> 
    
    <!-- !data -->
    <div v-else>
      <loading-placeholder-list/>
    </div>
  </div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { webSocket } from 'rxjs/webSocket';
import { bufferCount } from 'rxjs/operators';
import { streamWS } from '@/libs/endpoints';
import { RSVPEvent } from '@/interfaces/map.ts';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import LoadingPlaceholderList from '@/components/loading-placeholder-list.vue';
import IconSubject from '@/components/icon-subject.vue';
import IconList from '@/components/icon-list.vue';
import KsqlQueryText from '@/components/ksql-query-text.vue';

@Component({
  name: 'list-user',
  components: {
    IconSubject,
    IconList,
    LoadingPlaceholderList,
    KsqlQueryText,
  },
})
export default class extends DashboardWidget {
  private titlesection = 'Stream RSVPs';
  private data: RSVPEvent[] = [];

  private queryText: string = `CREATE STREAM RSVP_RECEIVED AS SELECT EVENT->
    EVENTNAME AS EVENTNAME,
    \`GROUP\`->GROUPLAT AS LATITUDE,
    \`GROUP\`->GROUPLON AS LONGITUDE,
    MTIME AS TIMESTAMP,
    EVENT->EVENTURL AS EVENTURL,
    MEMBER->MEMBERNAME AS USERNAME,
    \`GROUP\`->GROUPNAME AS GROUPNAME,
    \`GROUP\`->GROUPCITY AS GROUPCITY,
    \`GROUP\`->GROUPCOUNTRY AS GROUPCOUNTRYCODE,
    RESPONSE FROM RSVP_RAW_STREAM;`;

  private mounted() {
    const url = streamWS('flights');
    this.socket = webSocket(url);
    this.socket.pipe(
      bufferCount(5),
    ).subscribe(
      (messages: any) => this.data = messages,
    );
  }

}
</script>

<style lang="scss" scoped src="@/styles/components/list-user.scss">

<template>
  <div class="col-12 col-sm-12 col-md-12 col-lg-6 top-five">

  <div v-if="countries.length > 0 && cities.length > 0 && topics.length > 0 ">
      <div class="change-view" >
        <h5>Top 5 of the last 10 seconds</h5>
        <div>
          <span>
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
        <div class="row trend">
          <div class="col-12 col-sm-12 col-md-4 col-lg-4">
            <list-rsvp-countries :data="countries" />
          </div>
          <div class="col-12 col-sm-12 col-md-4 col-lg-4">
            <list-rsvp-cities :data="cities" />
          </div>
          <div class="col-12 col-sm-12 col-md-4 col-lg-4">
            <list-rsvp-topics :data="topics" />
          </div>
        </div> 
      </div>

      <!-- showRsvp -->
      <div v-else> 
        <div class="row query">
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <ksql-query-text
              title="Top countries"
              :text="CountriesQueryText"
            />
          </div>
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <ksql-query-text
              title="Top cities"
              :text="CitiesQueryText"
            />
          </div>
          <div class="col-12 col-sm-12 col-md-12 col-lg-4">
            <ksql-query-text
              title="Top topics"
              :text="TopicsQueryText"
            />
          </div>
        </div>  
      </div>   
    </div>

    <!-- showTrend-->
    <div v-else >
      <loading-placeholder-five />
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getName } from 'country-list';
import { webSocket } from 'rxjs/webSocket';
import ListRsvpCountries from '@/components/list-rsvp-countries.vue';
import ListRsvpCities from '@/components/list-rsvp-cities.vue';
import ListRsvpTopics from '@/components/list-rsvp-topics.vue';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import { streamWS } from '@/libs/endpoints';
import { Country, Topic, City, TopData } from '@/interfaces/dashboard';
import IconList from '@/components/icon-list.vue';
import IconSubject from '@/components/icon-subject.vue';
import LoadingPlaceholderFive from '@/components/loading-placeholder-five.vue';
import KsqlQueryText from '@/components/ksql-query-text.vue';

@Component({
  name: 'top-five',
  components: {
    ListRsvpCountries,
    ListRsvpCities,
    ListRsvpTopics,
    IconSubject,
    IconList,
    LoadingPlaceholderFive,
    KsqlQueryText,
  },
})
export default class extends DashboardWidget {
  private countries: TopData[] = [];
  private topics: TopData[] = [];
  private cities: TopData[] = [];

  private CitiesQueryText: string = `CREATE STREAM RSVP_RAW_CITIES AS SELECT 'all' AS K,
  \`GROUP\`->GROUPCITY AS CITY FROM RSVP_RAW_STREAM;
  CREATE TABLE TOP_CITIES_CHANGED AS SELECT K, WINDOWSTART() AS TIMESTAMP,
  TOPKDISTINCT(CITY, 5) AS TOP_5_CITIES FROM RSVP_RAW_CITIES WINDOW TUMBLING (SIZE 10
  SECONDS) GROUP BY K;`;
  private CountriesQueryText: string = `CREATE STREAM RSVP_RAW_COUNTRIES AS SELECT 'all' AS K,
  \`GROUP\`->GROUPCOUNTRY AS COUNTRY FROM RSVP_RAW_STREAM;
  CREATE TABLE TOP_COUNTRIES_CHANGED AS SELECT K, WINDOWSTART() AS TIMESTAMP,
  TOPKDISTINCT(COUNTRY, 5) AS TOP_5_COUNTRIES FROM RSVP_RAW_COUNTRIES WINDOW TUMBLING
  (SIZE 10 SECONDS) GROUP BY K;`;
  private TopicsQueryText: string = `CREATE STREAM RSVP_RAW_TOPICS AS SELECT 'all' AS K,
  GROUPTOPIC->TOPICNAME AS TOPICNAME FROM RSVP_TOPICS_STREAM;
  CREATE TABLE TOP_TOPICS_CHANGED AS SELECT K, WINDOWSTART() AS TIMESTAMP,
  TOPKDISTINCT(TOPICNAME, 5) AS TOP_5_TOPICS FROM RSVP_RAW_TOPICS WINDOW TUMBLING
  (SIZE 10 SECONDS) GROUP BY K;`;

  private listen(url: string) {
    this.socket = webSocket(url);

    this.socket.subscribe((event: any) => {
      const { eventType } = event;

      switch (eventType) {
        case 'TopCountriesChanged':
          const countries: Country[] = event.eventPayload.elements;
          this.countries = countries.map((e: Country, i: number): TopData => ({
            name: getName(e.countryName),
            count: e.eventCount,
            percent: (100 * e.eventCount) / countries[0].eventCount,
          }));
          break;
        case 'TopTopicsChanged':
          const topics: Topic[] = event.eventPayload.elements;
          this.topics = topics.map((e: Topic, i: number): TopData => ({
            name: e.topicName,
            count: e.eventCount,
            percent: (100 * e.eventCount) / topics[0].eventCount,
          }));
          break;
        case 'TopCitiesChanged':
          const cities: City[] = event.eventPayload.elements;
          this.cities = cities.map((e: City, i: number): TopData => ({
            name: e.cityName,
            count: e.eventCount,
            percent: (100 * e.eventCount) / cities[0].eventCount,
          }));
          break;
        default:
          return;
      }
    });
  }

  private mounted() {
    this.listen(streamWS('topElementsChanged'));
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/top-five.scss">

<template>
  <div>
    <!-- hasData -->
    <div class="graph-rsvp-info" v-show="hasData">
      <div class="change-view" >
        <h5>{{ titlesection }}</h5> 
        <div>
          <span>
            <button class="btn"
              aria-label="Show widget"
              v-on:click="toggleWidget()" 
              v-bind:class="isSelected(displayWidget, true)"
            >
              <icon-chart />
            </button>
          </span>
          <span>
            <button class="btn" 
              aria-label="Show KSQL Query"
              v-on:click="toggleWidget()" 
              v-bind:class="isSelected(displayWidget, false)"
            >
              <icon-subject />
            </button>
          </span>
        </div>
      </div>

      <!-- showTrend -->
      <div v-if="displayWidget" class="trend">
        <div>
          <span>Start date:</span>
          <span class="start-date">{{startdate}} at {{starttime}}</span>
        </div>
        <div> 
          <span>Total:</span>
          <span class="total-rsvp"><b> {{total}}</b></span>
        </div>
        <div id="chart">
          <apexchart
            ref="realtimeChart"
            type="area" 
            height="200" 
            :options="queryChart" 
            :series="series" 
          />
        </div>
      </div>

      <!-- showRsvp -->
      <div v-else class="query">
        <ksql-query-text
          :text="queryText"
        />
      </div>     
    </div>

    <!-- !hasData -->
    <div v-show="!hasData">
      <loading-placeholder-graph/>
    </div> 
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { webSocket } from 'rxjs/webSocket';
import VueApexCharts from 'vue-apexcharts';
import { streamWS } from '@/libs/endpoints';
import DashboardWidget from '@/libs/classes/dashboardwidget';
import { ChartPoint, TrendEvent } from '@/interfaces/dashboard';
import IconSubject from '@/components/icon-subject.vue';
import IconChart from '@/components/icon-chart.vue';
import IconList from '@/components/icon-list.vue';
import LoadingPlaceholderGraph from '@/components/loading-placeholder-graph.vue';
import KsqlQueryText from '@/components/ksql-query-text.vue';

Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

@Component({
  name: 'graph-chart',
  components: {
    IconChart,
    IconList,
    LoadingPlaceholderGraph,
    KsqlQueryText,
    IconSubject,
  },
})
export default class extends DashboardWidget {
  private titlesection: string = 'Trend RSVP';
  private total: number = 0;
  private startdate: string = '';
  private starttime: string = '';
  private locale: string = 'en-EN';

  private queryText: string = `CREATE STREAM RSVP_RAW_IDS AS SELECT 'all' AS K,
  RSVPID AS ID FROM RSVP_RAW_STREAM;
  CREATE TABLE RSVP_TREND AS SELECT K, COUNT(*) AS TOTAL, WINDOWSTART() AS TIMESTAMP
  FROM RSVP_RAW_IDS WINDOW TUMBLING (SIZE 10 SECONDS) GROUP BY K;`;

  private series = [{
    name: 'RSVP events',
    data: [],
  }];

  private queryChart = {
    chart: {
      width: '100%',
      height: '100%',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        type: 'line',
      },
      colors: ['#eb6400', '#fff3e1'],
      dataLabels: {
        enabled: true,
        style: {
              fontSize: '11px',
              colors: ['#5C5C5C'],
        },
      },
      xaxis: {
        type: 'datetime',
        range: 100000,
        labels: {
          formatter(value: Date, timestamp: Date): string {
            return new Date(timestamp).toLocaleTimeString('en-EN');
          },
          style: {
              fontSize: '11px',
              colors: ['#5C5C5C'],
            },
        },
      },
      markers: {
        size: 0,
      },
      tickPlacement: 'between',

      grid: {
        show: true,
        borderColor: '#F5F5F5',
      },
      stroke: {
        show: true,
        width: 2,
      },
  };

  private mounted() {
    this.getData();
  }

  private getData() {
    const url: string = streamWS('rsvpTrend');
    const raw: ChartPoint[] = [];

    const date: Date = new Date();
    this.startdate = new Intl.DateTimeFormat(this.locale).format(date);
    this.starttime = date.toLocaleTimeString();

    this.socket = webSocket(url);
    this.socket.subscribe(
      (event: TrendEvent) => {
        this.total = this.total + event.count;

        raw.push({
          x: new Date(event.timestamp),
          y: event.count,
        });

        const chart: any = this.$refs.realtimeChart;
        // @ts-ignore
        const exists: () => void = chart && chart.updateSeries;

        if (exists) {
          // @ts-ignore
          this.$refs.realtimeChart.updateSeries([{
            name: `Total RSVP events`,
            data: raw,
          }]);

          this.hasData = true;
        } else {
          this.hasData = false;
        }

      },
      // (err: any) => console.warn(err), // Called if at any point WebSocket API signals some kind of error.
      // () => console.warn('complete'), // Called when connection is closed (for whatever reason).
    );
  }
}
</script>
<style lang="scss" scoped src="@/styles/components/graph-chart.scss">

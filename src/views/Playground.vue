<template>
<div>
  <div class="container">
 TEST
       <h3>Table</h3>
    <table-rsvp/>
    <hr>
    <h3>Progress bar</h3>
    <amber-progress/>
    <hr>
    <h3>Button Group </h3>
    <button-group/>  
    <hr>
    <h3>List User</h3>
    <list-user/>
    <hr>
    <h3>Graph Rsvp Info</h3>
    <hr>
    <graph-chart/>
    <h3>Form</h3>
    <hr>
    <form-ksql/>
    <hr>
    <loading-placeholder-list/>
    <hr>
    <loading-placeholder-five/>
    <hr>
    <loading-placeholder-graph/> 
    <!-- Show hide element - loading data  -->
    <div v-if="Math.random() > 0.5">Now you see me</div>
    <div v-else>Now you don't</div>

    <!-- Show hide box - show only one button -->
    <div>
      <div v-on:click="showTopFive = !showTopFive">
          <span v-if="showTopFive"> A </span>
          <span v-else> B </span>
        </div>
        <p v-show="showTopFive"> BOX A </p>
        <p v-show="!showTopFive"> BOX B </p>
      </div>
      <!-- Show hide box - show two button -->
        <div>
          <button style="background:none; border:none" v-on:click="doShowTrend()" v-bind:class="getTrendClass()" > <icon-chart /></button>
          <button style="background:none; border:none" v-on:click="doShowRSVP()" v-bind:class="getRSVPClass()"><icon-list /></button>
          <p v-show="showTrend">A</p>
          <p v-show="showRsvp">B</p>     
        </div>


    </div>
     <hr>
      <loading-placeholder-five/>
    <hr>
      <loading-placeholder-list/>
    <hr>
    <loading-placeholder-graph/>

</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import AmberProgress from '@/components/amber-progress.vue';
import ButtonGroup from '@/components/button-group.vue';
import ListUser from '@/components/list-user.vue';
import GraphRsvpInfo from '@/components/graph-rsvp-info.vue';
import TableRsvp from '@/components/table-rsvp.vue';
import GraphChart from '@/components/graph-chart.vue';
import FormKsql from '@/components/form-ksql.vue';
import IconPause from '@/components/icon-pause.vue';
import IconPlay from '@/components/icon-play.vue';
import IconChart from '@/components/icon-chart.vue';
import IconList from '@/components/icon-list.vue';
import IconSubject from '@/components/icon-subject.vue';
import LoadingPlaceholderList from '@/components/loading-placeholder-list.vue';
import LoadingPlaceholderFive from '@/components/loading-placeholder-five.vue';
import LoadingPlaceholderGraph from '@/components/loading-placeholder-graph.vue';

@Component({
  components: {
    'world-map': () => import('@/components/world-map.vue'),
    // AmberProgress,
    ButtonGroup,
    ListUser,
    GraphRsvpInfo,
    TableRsvp,
    GraphChart,
    FormKsql,
    IconPlay,
    IconPause,
    IconChart,
    IconList,
    LoadingPlaceholderList,
    LoadingPlaceholderFive,
    LoadingPlaceholderGraph,
    IconSubject,
  },
})
export default class Playground extends Vue {
  private noData = 'Loading data';
  private showTopFive: boolean = false;


  private showRsvp: boolean = false;
  private showTrend: boolean = true;


  private doShowTrend() {
    if (!this.showTrend) {
      this.showTrend = true;
      this.showRsvp = false;
    }
  }
  private doShowRSVP() {
    if (!this.showRsvp) {
      this.showRsvp = true;
      this.showTrend = false;
    }
  }
  private getRSVPClass() {
    return {
      selected : this.showRsvp,
    };
  }

  private getTrendClass() {
    return {
      selected : this.showTrend,
    };
  }

}
</script>

<style lang="scss" scoped>
@import './../styles/styles.scss';
.selected{
  color:red;
}
</style>  
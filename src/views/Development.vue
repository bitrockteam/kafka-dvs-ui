<template>
  <div>
    <!-- <button-pause /> -->
    <router-link to="/" class="back-home">
      <icon-arrow-left /> Back to Dashboard
    </router-link>
    <div class="develop">
      <main-dashboard />
      <develop-rsvp>
        <table-rsvp :data="data" />
      </develop-rsvp>
    </div>  
  </div>    
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { lowercaseObj, checkString } from '@/libs/utils';
import DevelopRsvp from '@/components/develop-rsvp.vue';
import ButtonPause from '@/components/button-pause.vue';
import IconArrowLeft from '@/components/icon-arrow-left.vue';
import TableRsvp from '@/components/table-rsvp.vue';
import { restAPI, streamWS } from '@/libs/endpoints';
import { Message } from '@/interfaces/development';
import { RSVPEvent } from '../interfaces/map';

const MainDashboard = () => import('@/components/main-dashboard.vue');

@Component({
  components: {
    MainDashboard,
    DevelopRsvp,
    ButtonPause,
    IconArrowLeft,
    TableRsvp,
  },
})
export default class Development extends Vue {
  @Getter private requesting!: boolean;
  @Getter private query!: string;

  private socket: any = null;
  private data: any[] = [];

  @Mutation private updateSocket!: (url: string) => void;
  @Mutation private stopRequest!: () => void;
  @Mutation private resetDev!: () => void;

  @Watch('requesting')
  private _req(val: boolean) {
    val ? this.getData() : this.closeSocket();
  }

  private getData() {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ksql: this.query }),
    };

    fetch(restAPI('ksql'), options)
      .then((response) => response.json())
      .then((data) => this.startStream(data))
      .catch((err) => this.stopRequest());
  }

  private startStream(data: any) {
    const endpoint: string = data.endpoint.replace('stream/', '');
    const url: string = streamWS(endpoint);

    this.updateSocket(endpoint);
    this.socket = webSocket(url);

    this.socket.pipe(
      map((message: Message) => checkString(message.data)),
      map((evt: RSVPEvent) => lowercaseObj(evt)),
    ).subscribe(
      (message: any) =>
        this.data.unshift(message),
    );
  }

  private closeSocket() {
    if (this.socket) {
      this.socket.unsubscribe();
    }
    this.resetDev();
    this.data = [];
  }

  private destroyed() {
    this.closeSocket();
  }
}
</script>

<style lang="scss" src="@/styles/develop.scss" />
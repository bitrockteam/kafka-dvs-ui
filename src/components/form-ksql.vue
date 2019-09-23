<template>
  <div class="ksql-form">
     <h5>Query KSQL</h5>
    <form action>
      <textarea 
        id="textArea" 
        :value="query" 
        cols="60" 
        rows="10"
        :disabled="requesting"
        :placeholder="query"
        @keyup="updateQuery">
      </textarea>
      <div class="ksql-button">
        <amber-button 
          class="btnText" 
          priority="tertiary" 
          @click="resetQuery"
          :disabled="requesting"
          nooutline
        >
          Reset
        </amber-button>
        <amber-button 
          class="btnText" 
          priority="primary" 
          @click="submit"
          nooutline
        >
          <span v-if="!requesting">RUN</span>
          <span v-else>STOP</span>
        </amber-button>
      </div>
    </form>
  </div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, Getter } from 'vuex-class';
import { restAPI } from '@/libs/endpoints';

import '@amber-ds/components/button';

@Component({
  name: 'form-ksql',
})
export default class extends Vue {
  @Getter private query!: string;
  @Getter private requesting!: boolean;
  @Getter private getSessions!: string[];

  @Mutation private updateQuery!: () => void;
  @Mutation private resetQuery!: () => void;
  @Mutation private startRequest!: () => void;
  @Mutation private stopRequest!: () => void;
  @Mutation private cleanSessions!: () => void;

  private clean() {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ streamIds: this.getSessions }),
    };

    fetch(restAPI('session/clean'), options)
      .then((response) => response.json())
      .then((data) => this.cleanSessions());
  }

  private stop() {
    this.stopRequest();
    this.clean();
  }

  private submit() {
    this.requesting ?
      this.stop() :
      this.startRequest();
  }
  private destroyed() {
    this.clean();
  }
}
</script>

<style lang="scss" scoped src="@/styles/components/form-ksql.scss">

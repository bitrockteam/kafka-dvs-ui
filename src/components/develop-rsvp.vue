<template>
<div>
  <div v-bind:class="{ maximized: !maximized, 'develop-rsvp': true }">
   <div class="copyright">COPYRIGHT 2019 -
      <a href="https://bitrock.it/" rel="noopener" target=_blank>BITROCK S.R.L.</a> 
    </div>
    <button 
      class="toggle-button" 
      aria-label="toggle map button" 
      @click="toggleMaximize"
    >
      <icon-expand-more />
    </button>
    <div v-show="!maximized">
      <container-rsvp>
        <div slot="develop-rsvp">
          <div class="develop-ksql">
            <form-ksql /> 
            <slot></slot>
          </div>
        </div>
      </container-rsvp>
    </div>
  </div>
</div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import IconExpandMore from '@/components/icon-expand-more.vue';
import ContainerRsvp from '@/components/container-rsvp.vue';
import FormKsql from '@/components/form-ksql.vue';

@Component({
  name: 'develop-rsvp',
  components: {
    IconExpandMore,
    ContainerRsvp,
    FormKsql,
  },
})
export default class extends Vue {
  @Getter private maximized!: boolean;

  @Mutation private toggleMaximize!: () => void;
}
</script>
<style lang="scss" src="@/styles/components/main-dev-rsvp.scss"/></style>
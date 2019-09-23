<template>
  <div>
    <list-user />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ListUser from '@/components/list-user.vue';
import IconSubject from '@/components/icon-subject.vue';
import IconList from '@/components/icon-list.vue';

@Component({
  name: 'list-rsvp-user',
   components: {
    ListUser,
    IconSubject,
    IconList,
  },
})
export default class extends Vue {
 private showRsvp: boolean = false;
 private titlesection = 'Stream RSVPs';
}
</script>




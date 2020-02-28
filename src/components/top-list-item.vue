<template>
    <div class="top-list-item">
        <amber-progress-bar
              onmouseover="" 
              style="cursor: pointer;"
              @click="select"
              :label="name"
              :value="percent"
              :display="count"
              :format="format"
              :disabled=!selected
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import '@amber-ds/components/progress-bar';

@Component({
    name: 'top-list-item',
    props: {
        name: {
            type: String,
            required: true,
        },
        percent: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        format: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            selected: true,
        };
    },
    methods: {
        select() {
            this.$data.selected = !this.$data.selected;
        },
    },
})
export default class extends Vue {
}

</script>

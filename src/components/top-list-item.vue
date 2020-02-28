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
              :disabled=isDisabled
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
            required: true,
        },
        format: {
            type: String,
            required: false,
            default: '',
        },
        selectedItem: {
            type: String,
            required: false,
        },
    },
    computed: {
        isDisabled() {
            return this.$props.selectedItem != null && this.$props.selectedItem !== this.$props.name;
        },
    },
    methods: {
        select() {
            this.$emit('select', this.$props.name);
        },
    },
})
export default class extends Vue {
}

</script>

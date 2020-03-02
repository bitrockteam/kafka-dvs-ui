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
import TopSelectedItem from '@/libs/classes/top-selected-item';

@Component({
    name: 'top-list-item',
    props: {
        name: {
            type: String,
            required: true,
        },
        type: {
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
            type: TopSelectedItem,
            required: false,
        },
    },
    computed: {
        isDisabled() {
            return this.$props.selectedItem != null && (
                this.$props.selectedItem.type !== this.$props.type || this.$props.selectedItem.value !== this.$props.name
            );
        },
    },
    methods: {
        select() {
            this.$emit('select', new TopSelectedItem(this.$props.type, this.$props.name));
        },
    },
})
export default class extends Vue {
}

</script>

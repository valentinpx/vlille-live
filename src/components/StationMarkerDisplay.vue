<template>
  <div 
    class="station-marker-display"
    v-html="markerHTML"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Station } from '@/types';
import { generateCompleteMarkerHTML } from '@/utils/markerUtils';

interface Props {
  station: Station;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
});

const markerHTML = computed(() => {
  return generateCompleteMarkerHTML(props.station, props.size);
});
</script>

<style scoped>
.station-marker-display {
  display: inline-flex;
}

.station-marker-display:hover :deep(> div) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
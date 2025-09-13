<script>
export default {
  name: "Scrollview",
  props: ["w", "h"],
}
</script>

<template>
  <div class="scrollable-container" :style="{ maxHeight: h, width: w }">
    <slot></slot>
  </div>
</template>

<style scoped>
.scrollable-container {
  overflow-y: auto;
  background: #f3e8ff;
  transition: background 0.2s;
}

.dark-theme .scrollable-container {
  background: #2c2a4a;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .scrollable-container::-webkit-scrollbar-track {
  background: #3c3a5e;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .scrollable-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #666; 
}

.dark-theme .scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #8a7cff;
}
</style>
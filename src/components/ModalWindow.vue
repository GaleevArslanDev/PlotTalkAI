<script>
import { ref } from 'vue';

export default {
  name: 'ModalWindow',
  props: {
    header: { type: String, required: true },
    showButtons: { type: Boolean, required: false },
    regen: { type: Boolean, required: false },
  },
  data() {
    return {
      darkTheme: false,
      language: 'ru',
    };
  },
  mounted() {
    this.darkTheme = localStorage.getItem('darkTheme') === '1';
    document.body.classList.toggle('dark-theme', this.darkTheme);
    this.language = localStorage.getItem('locale') || this.$i18n.locale || 'ru';
    this.$i18n.locale = this.language;
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    closeModal() {
      if (this.showButtons) {
        this.$emit('closeModal', false);
      }
    },
    handleSubmit(data) {
      this.$emit('validate-request', data);
      if (this.regen) {
        this.$emit('regenerate', data);
      }
    },
    handleStorageChange(event) {
      if (event.key === 'darkTheme') {
        this.darkTheme = event.newValue === '1';
        document.body.classList.toggle('dark-theme', this.darkTheme);
      }
      if (event.key === 'locale') {
        this.language = event.newValue || 'ru';
        this.$i18n.locale = this.language;
      }
    },
  },
};
</script>

<template>
  <div class="modal-window-container">
    <div class="modal-window-background" @click="closeModal"></div>
    <form class="modal-dialog noselect" @submit.prevent="handleSubmit">
      <button class="modal-dialog-close" v-if="showButtons" @click="closeModal" :title="$t('common.close')">
        <svg width="28" height="28" fill="none">
          <path d="M7 7l14 14M21 7L7 21" stroke="#a352fa" stroke-width="2" />
        </svg>
      </button>
      <div class="modal-dialog-header">
        <h1 class="modal-dialog-header-text">{{ header }}</h1>
      </div>
      <div class="modal-dialog-body">
        <slot></slot>
      </div>
      <div class="modal-dialog-footer">
        <button class="btn save-btn" v-if="showButtons" type="submit">{{ $t('common.save') }}</button>
        <button class="btn save-btn" v-if="showButtons && regen" type="submit">{{ $t('common.regenerate') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.modal-window-container {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  background: #f8f0ff;
  border-radius: 18px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 12px 48px rgba(171, 114, 231, 0.3);
  padding: 36px 38px 24px 38px;
  position: relative;
  overflow-y: hidden;
  height: fit-content;
  z-index: 100;
}

.dark-theme .modal-dialog {
  background: #2c2a4a;
  box-shadow: 0 12px 48px rgba(90, 79, 207, 0.4);
}

.modal-window-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(100, 60, 90, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dark-theme .modal-window-background {
  background: rgba(20, 18, 38, 0.75);
}

.modal-dialog-header {
  justify-self: center;
}

.modal-dialog-header-text {
  color: #7b3fe4;
  margin-bottom: 18px;
  font-size: 36px;
  font-weight: 700;
  text-align: left;
  text-shadow: 1.5px 1.5px 2px rgba(171, 114, 231, 0.4);
}

.dark-theme .modal-dialog-header-text {
  color: #e8e4ff;
  text-shadow: 1.5px 1.5px 2px rgba(127, 90, 240, 0.4);
}

.modal-dialog-body {
  max-height: 65vh;
  overflow-y: auto;
}

.modal-dialog-body::-webkit-scrollbar {
  width: 8px;
}

.modal-dialog-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .modal-dialog-body::-webkit-scrollbar-track {
  background: #3c3a5e;
}

.modal-dialog-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .modal-dialog-body::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.modal-dialog-body::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.dark-theme .modal-dialog-body::-webkit-scrollbar-thumb:hover {
  background: #8a7cff;
}

.modal-dialog-footer {
  margin-top: 10px;
  margin-bottom: 10px;
}

.modal-dialog-footer > .btn {
  float: right;
  margin-left: 2vw;
}

.save-btn {
  background: linear-gradient(90deg, #b392ff 20%, #d9e4ff 100%);
  color: #4a2670;
  border: none;
  border-radius: 7px;
  font-size: 21px;
  padding: 10px 36px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(171, 114, 231, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .save-btn {
  background: linear-gradient(90deg, #5b4cb8 20%, #8a7cff 100%);
  color: #e8e4ff;
  box-shadow: 0 2px 10px rgba(90, 79, 207, 0.4);
}

.save-btn:hover {
  background: #e0d7ff;
  transform: scale(1.04);
}

.dark-theme .save-btn:hover {
  background: #6f61d0;
}

.modal-dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 30px;
  padding: 0 4px;
  transition: transform 0.1s;
  float: right;
}

.modal-dialog-close svg {
  stroke: #a352fa;
}

.dark-theme .modal-dialog-close svg {
  stroke: #9f8cff;
}

.modal-dialog-close:hover {
  transform: scale(1.18) rotate(7deg);
}
</style>
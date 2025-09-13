<template>
  <ModalWindow
    v-if="showModal"
    @closeModal="handleClose"
    @validate-request="submitPrompt"
    :showButtons="true"
    :header="'Редактировать'"
    width="800px"
  >
    <div class="prompt-editor">
      <div class="text-field">
        <textarea
          v-model="mainPrompt"
          placeholder="Введите текст диалога..."
          @input="handleInput"
        ></textarea>
      </div>

      <div class="prompt-label">
        <span>Дополнить промпт</span>
      </div>

      <div class="additional-field">
        <textarea
          v-model="additionalPrompt"
          placeholder="Дополнительные уточнения..."
          @input="handleInput"
        ></textarea>
        <button
          class="regenerate-btn"
          @click="regeneratePrompt"
          title="Перегенерировать"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4V8H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H8M20 20V16H19.4185M19.4185 16C18.2317 18.9318 15.3574 21 12 21C7.92038 21 4.55399 17.9463 4.06189 14M19.4185 16H16"
              stroke="#7b3fe4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow.vue';

export default {
  name: 'RegenerateModal',
  components: { ModalWindow },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    initialMainPrompt: {
      type: String,
      default: ''
    },
    initialAdditionalPrompt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mainPrompt: this.initialMainPrompt,
      additionalPrompt: this.initialAdditionalPrompt
    };
  },
  methods: {
    handleInput() {
      this.$emit('update', {
        main: this.mainPrompt,
        additional: this.additionalPrompt
      });
    },
    regeneratePrompt() {
      this.$emit('regenerate');
    },
    submitPrompt() {
      if (!this.mainPrompt.trim()) {
        alert('Пожалуйста, введите текст диалога');
        return;
      }
      this.$emit('submit', {
        main: this.mainPrompt,
        additional: this.additionalPrompt
      });
    },
    handleClose() {
      this.$emit('close');
    }
  },
  watch: {
    initialMainPrompt(newVal) {
      this.mainPrompt = newVal;
    },
    initialAdditionalPrompt(newVal) {
      this.additionalPrompt = newVal;
    }
  }
};
</script>

<style scoped>
.prompt-editor {
  width: 100%;
  padding: 16px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f8f0ff;
  color: #4a2670;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.dark-theme .prompt-editor {
  background: #2c2a4a;
  color: #e8e4ff;
}

.text-field,
.additional-field {
  margin-bottom: 0;
  position: relative;
  min-width: 0;
}

.prompt-label span {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #7b3fe4;
  transition: color 0.2s;
}

.dark-theme .prompt-label span {
  color: #e8e4ff;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #b392ff;
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
  background-color: #fff1ff;
  color: #4a2670;
  box-sizing: border-box;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.dark-theme textarea {
  border-color: #5b4cb8;
  background-color: #3c3a5e;
  color: #e8e4ff;
}

.additional-field textarea {
  min-height: 80px;
}

textarea:focus {
  outline: none;
  border-color: #9f8cff;
  box-shadow: 0 0 0 1px #9f8cff;
}

.dark-theme textarea:focus {
  border-color: #8a7cff;
  box-shadow: 0 0 0 1px #8a7cff;
}

.additional-field {
  display: flex;
  gap: 8px;
}

.regenerate-btn {
  width: 40px;
  height: 40px;
  align-self: flex-end;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}

.dark-theme .regenerate-btn {
  background: #4a466e;
  border-color: #5b4cb8;
}

.regenerate-btn:hover {
  background: #e0d7ff;
  border-color: #b392ff;
}

.dark-theme .regenerate-btn:hover {
  background: #6f61d0;
  border-color: #8a7cff;
}

.regenerate-btn svg {
  stroke: #7b3fe4;
  transition: stroke 0.2s;
}

.dark-theme .regenerate-btn svg {
  stroke: #9f8cff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ddd6fe;
  transition: border-color 0.2s;
}

.dark-theme .modal-actions {
  border-top-color: #5b4cb8;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.cancel-btn {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  color: #4a2670;
}

.dark-theme .cancel-btn {
  background: #4a466e;
  border-color: #5b4cb8;
  color: #e8e4ff;
}

.cancel-btn:hover {
  background: #e0d7ff;
}

.dark-theme .cancel-btn:hover {
  background: #6f61d0;
}

.submit-btn {
  background: #7b3fe4;
  border: 1px solid #7b3fe4;
  color: #ffffff;
}

.dark-theme .submit-btn {
  background: #9f8cff;
  border-color: #9f8cff;
}

.submit-btn:hover {
  background: #9f8cff;
}

.dark-theme .submit-btn:hover {
  background: #8a7cff;
}

.modal-window-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1000;
}

.modal-dialog-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 80vh;
}
</style>
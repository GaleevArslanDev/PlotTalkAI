<template>
  <div v-if="visible" class="modal-bg" @click.self="closeModal">
    <div class="modal-window">
      <!-- Header actions -->
      <div class="modal-actions">
        <button class="icon-btn" @click="deleteCharacter" title="Удалить персонажа">
          <!-- Trash icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#7b3fe4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
        <button class="icon-btn" @click="closeModal" title="Закрыть">
          <!-- Close icon -->
          <svg width="24" height="24" fill="none">
            <path d="M7 7l14 14M21 7L7 21" stroke="#7b3fe4" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <h1 class="modal-title">Персонаж</h1>

      <div class="modal-grid">
        <!-- Left column -->
        <div class="modal-column">
          <div class="field-group">
            <label>Имя</label>
            <input v-model="form.name" type="text" />
          </div>
          <div class="field-group">
            <label>Профессия</label>
            <input v-model="form.profession" type="text" />
          </div>
          <h2 class="section-title">Характеристика</h2>
          <textarea v-model="form.description"></textarea>
        </div>

        <!-- Right column -->
        <div class="modal-column">
          <div class="field-group">
            <label>Тип</label>
            <select v-model="form.type">
              <option value="NPC">NPC</option>
              <option value="PC">PC</option>
            </select>
          </div>
          <div class="field-group">
            <label>Настроение</label>
            <input v-model="form.mood" type="text" />
          </div>
          <div class="field-group">
            <label>Стиль речи</label>
            <input v-model="form.speech" type="text" />
          </div>
          <div class="field-group">
            <label>Внешний вид</label>
            <input v-model="form.appearance" type="text" />
          </div>
          <div class="field-group">
            <label>Дополнительно</label>
            <textarea v-model="form.additional" class="small-textarea"></textarea>
          </div>
        </div>
      </div>

      <div class="modal-buttons">
        <button class="save-btn" @click="saveCharacter">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditCharacterModal',
  props: {
    visible: { type: Boolean, default: false },
    character: {
      type: Object,
      default: () => ({
        name: '',
        profession: '',
        description: '',
        type: 'NPC',
        mood: '',
        speech: '',
        appearance: '',
        additional: ''
      })
    }
  },
  data() {
    return {
      form: { ...this.character }
    };
  },
  watch: {
    character: {
      immediate: true,
      handler(newChar) {
        this.form = { ...newChar };
      }
    }
  },
  methods: {
    deleteCharacter() {
      alert('deleteCharacter: ' + JSON.stringify(this.form, null, 2));
      this.$emit('delete', this.form.id);
    },
    closeModal() {
      alert('closeModal');
      this.$emit('close');
    },
    saveCharacter() {
      alert('saveCharacter: ' + JSON.stringify(this.form, null, 2));
      this.$emit('save', { ...this.form });
    }
  }
};
</script>

<style scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(100, 60, 90, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dark-theme .modal-bg {
  background: rgba(20, 18, 38, 0.75);
}

.modal-window {
  background: #f8f0ff;
  border-radius: 18px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 48px rgba(171, 114, 231, 0.3);
  padding: 36px 38px 24px 38px;
  position: relative;
}

.dark-theme .modal-window {
  background: #2c2a4a;
  box-shadow: 0 12px 48px rgba(90, 79, 207, 0.4);
}

.modal-actions {
  position: absolute;
  top: 22px;
  right: 28px;
  display: flex;
  gap: 12px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.1s;
}

.icon-btn svg {
  stroke: #7b3fe4;
}

.dark-theme .icon-btn svg {
  stroke: #9f8cff;
}

.icon-btn:hover {
  transform: scale(1.2) rotate(10deg);
}

.modal-title {
  font-size: 32px;
  font-weight: 700;
  color: #7b3fe4;
  margin-bottom: 24px;
  text-shadow: 1.5px 1.5px 2px rgba(171, 114, 231, 0.4);
}

.dark-theme .modal-title {
  color: #e8e4ff;
  text-shadow: 1.5px 1.5px 2px rgba(90, 79, 207, 0.4);
}

.modal-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.modal-column {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-group label {
  font-weight: 600;
  color: #4a2670;
  margin-bottom: 4px;
  transition: color 0.2s;
}

.dark-theme .field-group label {
  color: #e8e4ff;
}

.field-group input,
.field-group select,
.field-group textarea {
  border: 1.5px solid #b392ff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  background: #fff1ff;
  color: #4a2670;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.dark-theme .field-group input,
.dark-theme .field-group select,
.dark-theme .field-group textarea {
  background: #3c3a5e;
  color: #e8e4ff;
  border-color: #5b4cb8;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
  border-color: #9f8cff;
}

.dark-theme .field-group input:focus,
.dark-theme .field-group select:focus,
.dark-theme .field-group textarea:focus {
  border-color: #8a7cff;
}

.section-title {
  margin: 0;
  font-size: 20px;
  color: #7b3fe4;
  font-weight: 600;
  transition: color 0.2s;
}

.dark-theme .section-title {
  color: #e8e4ff;
}

.field-group textarea {
  min-height: 120px;
  resize: vertical;
}

.small-textarea {
  min-height: 80px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.save-btn {
  background: linear-gradient(90deg, #b392ff 20%, #d9e4ff 100%);
  color: #4a2670;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(171, 114, 231, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .save-btn {
  background: linear-gradient(90deg, #5b4cb8 20%, #8a7cff 100%);
  color: #e8e4ff;
  box-shadow: 0 4px 16px rgba(90, 79, 207, 0.4);
}

.save-btn:hover {
  background: #e0d7ff;
  transform: translateY(-2px);
}

.dark-theme .save-btn:hover {
  background: #6f61d0;
}

/* Responsive layout */
@media (max-width: 700px) {
  .modal-grid {
    flex-direction: column;
  }
}
</style>
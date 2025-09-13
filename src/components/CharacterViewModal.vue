<template>
  <div v-if="visible" class="modal-bg" @click.self="close">
    <div class="modal-window">
      <!-- Кнопки удалить и закрыть -->
      <div class="modal-actions">
        <!-- Удалить последний персонаж (корзина) -->
        <button 
          class="icon-btn" 
          @click="deleteLast" 
          v-if="localChars.length > 0"
          title="Удалить последний"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="#7b3fe4" fill="#00000000" stroke-width="1.5px">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
        <!-- Закрыть (крестик) -->
        <button 
          class="icon-btn" 
          @click="close" 
          title="Закрыть"
        >
          <svg width="28" height="28" fill="none">
            <path d="M7 7l14 14M21 7L7 21" stroke="#7b3fe4" stroke-width="2px"/>
          </svg>
        </button>
      </div>

      <h1 class="modal-title">Персонажи</h1>

      <div class="modal-grid-characters">
        <div
          v-for="char in localChars"
          :key="char.id"
          class="character-item"
        >
          <span class="input">{{ char.name }}</span>
          <button 
            @click="editCharacter(char.id)" 
            class="icon-btn"
            title="Изменить"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="#7b3fe4" fill="#00000000" stroke-width="1.5px">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button 
            @click="deleteCharacter(char.id)" 
            class="icon-btn"
            title="Удалить"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="#7b3fe4" fill="#00000000" stroke-width="1.5px">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-buttons">
        <button @click="addCharacter" type="button" class="add-btn">
          Добавить персонажа
        </button>
        <button @click="save" type="button" class="save-btn">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CharactersModal",
  props: {
    visible:    { type: Boolean, default: false },
    characters: { type: Array,   default: () => [] }
  },
  data() {
    return {
      localChars: [],
      darkTheme: false, // Добавляем переменную для темной темы
    };
  },
  watch: {
    characters: {
      immediate: true,
      handler(newVal) {
        this.localChars = newVal.map(c => ({ ...c }));
      }
    }
  },
  mounted() {
    // Читаем значение darkTheme из localStorage при монтировании
    this.darkTheme = localStorage.getItem('darkTheme') === '1';
    document.body.classList.toggle('dark-theme', this.darkTheme);
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // Удаляем слушатель событий
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    addCharacter() {
      this.$emit('add')
    },
    deleteCharacter(id) {
      this.localChars = this.localChars.filter(c => c.id !== id);
    },
    deleteLast() {
      this.localChars.pop();
    },
    save() {
      this.$emit("save", this.localChars);
      this.close();
    },
    editCharacter(id) {
      this.$emit('edit', id)
    },
    handleStorageChange(event) {
      // Реакция на изменение localStorage
      if (event.key === 'darkTheme') {
        this.darkTheme = event.newValue === '1';
        document.body.classList.toggle('dark-theme', this.darkTheme);
      }
    },
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
  max-width: 600px;
  max-height: 80vh;
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
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s;
}

.icon-btn svg {
  stroke: #7b3fe4;
}

.dark-theme .icon-btn svg {
  stroke: #9f8cff;
}

.icon-btn:hover {
  transform: scale(1.18) rotate(7deg);
}

.modal-title {
  color: #7b3fe4;
  margin-bottom: 18px;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 1.5px 1.5px 2px rgba(171, 114, 231, 0.4);
}

.dark-theme .modal-title {
  color: #e8e4ff;
  text-shadow: 1.5px 1.5px 2px rgba(90, 79, 207, 0.4);
}

.modal-grid-characters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.character-item {
  display: flex;
  align-items: center;
  background: #fff1ff;
  border: 1.5px solid #b392ff;
  border-radius: 11px;
  padding: 8px 14px;
}

.dark-theme .character-item {
  background: #3c3a5e;
  border-color: #5b4cb8; 
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #4a2670;
  outline: none;
}

.dark-theme .input {
  color: #e8e4ff;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.add-btn,
.save-btn {
  background: linear-gradient(90deg, #b392ff 20%, #d9e4ff 100%);
  color: #4a2670;
  border: none;
  border-radius: 7px;
  font-size: 18px;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(171, 114, 231, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .add-btn,
.dark-theme .save-btn {
  background: linear-gradient(90deg, #5b4cb8 20%, #8a7cff 100%);
  color: #e8e4ff;
  box-shadow: 0 2px 10px rgba(90, 79, 207, 0.4);
}

.add-btn:hover,
.save-btn:hover {
  background: #e0d7ff;
  transform: scale(1.04);
}

.dark-theme .add-btn:hover,
.dark-theme .save-btn:hover {
  background: #6f61d0;
}
</style>
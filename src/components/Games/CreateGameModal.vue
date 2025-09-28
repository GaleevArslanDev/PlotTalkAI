<template>
  <ModalWindow :header="$t('createGame.title')" @validate-request="submit" @closeModal="close" :showButtons="true">
    <div class="modal-form">
      <div class="modal-grid">
        <div>
          <div class="field-group">
            <label class="field-label">{{ $t('createGame.name') }}</label>
            <input v-model="game.name" required class="input" :class="{ error: errors.name }" />
            <span class="error-label" v-if="errors.name">{{ $t('createScript.errors.required') }}</span>
          </div>
          <div class="field-group">
            <label class="field-label">{{ $t('createGame.description') }}</label>
            <textarea v-model="game.description" required class="input textarea" :class="{ error: errors.description }" />
            <span class="error-label" v-if="errors.description">{{ $t('createScript.errors.required') }}</span>
          </div>
        </div>
        <div>
          <div class="field-group">
            <label class="field-label">{{ $t('createGame.genre') }}</label>
            <select v-model="game.genre" required class="input" :class="{ error: errors.genre }">
              <option disabled value="">{{ $t('createGame.genre') }}</option>
              <option value="adventures">{{ $t('createGame.genres.adventures') }}</option>
              <option value="fantasy">{{ $t('createGame.genres.fantasy') }}</option>
              <option value="detective">{{ $t('createGame.genres.detective') }}</option>
              <option value="drama">{{ $t('createGame.genres.drama') }}</option>
              <option value="comedy">{{ $t('createGame.genres.comedy') }}</option>
              <option value="horror">{{ $t('createGame.genres.horror') }}</option>
              <option value="strategy">{{ $t('createGame.genres.strategy') }}</option>
            </select>
            <span class="error-label" v-if="errors.genre">{{ $t('createScript.errors.required') }}</span>
          </div>
          <div class="field-group">
            <label class="field-label">{{ $t('createGame.techLevel') }}</label>
            <select v-model="game.techLevel" required class="input" :class="{ error: errors.techLevel }">
              <option disabled value="">{{ $t('createGame.techLevel') }}</option>
              <option value="stoneAge">{{ $t('createGame.techLevels.stoneAge') }}</option>
              <option value="medieval">{{ $t('createGame.techLevels.medieval') }}</option>
              <option value="renaissance">{{ $t('createGame.techLevels.renaissance') }}</option>
              <option value="industrial">{{ $t('createGame.techLevels.industrial') }}</option>
              <option value="modern">{{ $t('createGame.techLevels.modern') }}</option>
              <option value="future">{{ $t('createGame.techLevels.future') }}</option>
              <option value="other">{{ $t('createGame.techLevels.other') }}</option>
            </select>
            <span class="error-label" v-if="errors.techLevel">{{ $t('createScript.errors.required') }}</span>
          </div>
          <div class="field-group">
            <label class="field-label">{{ $t('createGame.tonality') }}</label>
            <select v-model="game.tonality" class="input">
              <option value="neutral">{{ $t('createGame.tonalities.neutral') }}</option>
              <option value="heroic">{{ $t('createGame.tonalities.heroic') }}</option>
              <option value="tragic">{{ $t('createGame.tonalities.tragic') }}</option>
              <option value="comic">{{ $t('createGame.tonalities.comic') }}</option>
              <option value="fairytale">{{ $t('createGame.tonalities.fairytale') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from '../ModalWindow.vue';

export default {
  name: 'CreateGameModal',
  components: { ModalWindow },
  props: {
    showDelete: { type: Boolean, default: false },
    gameData: { type: Object, default: null },
  },
  data() {
    return {
      game: {
        name: '',
        description: '',
        genre: '',
        techLevel: '',
        tonality: 'neutral',
      },
      fieldsToValidate: ['name', 'description', 'genre', 'techLevel'],
      errors: {},
      darkTheme: false,
      language: 'ru',
    };
  },
  watch: {
    gameData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.game = {
            ...val,
            genre: val.genre || '',
            techLevel: val.techLevel || '',
            tonality: val.tonality || 'neutral',
          };
        }
      },
    },
    language(val) {
      this.$i18n.locale = val;
      localStorage.setItem('locale', val);
    },
  },
  mounted() {
    // Читаем тёмную тему из localStorage
    this.darkTheme = localStorage.getItem('darkTheme') === '1';
    document.body.classList.toggle('dark-theme', this.darkTheme);

    // Читаем язык из localStorage
    this.language = localStorage.getItem('locale') || this.$i18n.locale || 'ru';
    this.$i18n.locale = this.language;

    // Подписываемся на изменения в localStorage
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    // Удаляем слушатель событий
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    validate() {
      this.resetErrors();
      let isValid = true;

      for (const field of this.fieldsToValidate) {
        const value = this.game[field];
        if (typeof value === 'string') {
          if (!value.trim()) {
            this.errors[field] = true;
            isValid = false;
          }
        } else if (value === null || value === undefined) {
          this.errors[field] = true;
          isValid = false;
        }
      }

      return isValid;
    },
    resetErrors() {
      this.errors = {};
    },
    submit() {
      if (!this.validate()) {
        return;
      }
      this.$emit('save', { ...this.game });
      this.close();
    },
    close() {
      this.$emit('close');
    },
    remove() {
      this.$emit('delete');
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

<style scoped>
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 30px;
  padding: 0 4px;
  transition: transform 0.1s;
  color: #8f4cef;
}

.dark-theme .icon-btn {
  color: #a594f9;
}

.icon-btn:hover {
  transform: scale(1.18) rotate(7deg);
}

.modal-title {
  color: #8f4cef;
  margin-bottom: 18px;
  font-size: 36px;
  font-weight: 700;
  text-align: left;
  text-shadow: 1.5px 1.5px 2px #e1c5ff96;
}

.dark-theme .modal-title {
  color: #e2def8;
  text-shadow: 1.5px 1.5px 2px rgba(127, 90, 240, 0.3);
}

.modal-form {
  width: 100%;
}

.modal-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 5%;
}

.field-group {
  margin-bottom: 22px;
}

.field-label {
  display: block;
  font-size: 22px;
  font-weight: 500;
  color: #8f4cef;
  margin-bottom: 7px;
  text-align: left;
  text-shadow: 1.5px 1.5px 1.5px #dac6ff67;
}

.dark-theme .field-label {
  color: #e2def8;
  text-shadow: 1.5px 1.5px 1.5px rgba(127, 90, 240, 0.3);
}

.input {
  width: 100%;
  border-radius: 11px;
  border: 1.5px solid #b88df8;
  padding: 8px 14px;
  font-size: 19px;
  background: #fff1ff;
  outline: none;
  transition: border-color 0.15s, background 0.2s, color 0.2s;
  color: #35235b;
}

.dark-theme .input {
  background: #4a4376;
  color: #e2def8;
  border-color: #5a4fcf;
}

.input:focus {
  border-color: #a352fa;
}

.dark-theme .input:focus {
  border-color: #a594f9;
}

.input.error {
  border-color: #e57373;
}

.dark-theme .input.error {
  border-color: #cf6679;
}

.error-label {
  font-size: 14px;
  color: #e57373;
  margin-top: 4px;
  text-align: left;
  transition: color 0.2s;
}

.dark-theme .error-label {
  color: #cf6679;
}

.textarea {
  min-height: 110px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.35;
}

.textarea::-webkit-scrollbar {
  width: 8px;
}

.textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .textarea::-webkit-scrollbar-track {
  background: #3c3a5e;
}

.textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .textarea::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.textarea::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.dark-theme .textarea::-webkit-scrollbar-thumb:hover {
  background: #8a7cff;
}

.modal-buttons {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background: linear-gradient(90deg, #c08cff 20%, #cde0ff 100%);
  color: #601f7e;
  border: none;
  border-radius: 7px;
  font-size: 21px;
  padding: 10px 36px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px #e5d4ff33;
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .save-btn {
  background: linear-gradient(90deg, #6c5ce7 20%, #a594f9 100%);
  color: #e2def8;
  box-shadow: 0 2px 10px rgba(127, 90, 240, 0.3);
}

.save-btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
}

.dark-theme .save-btn:hover {
  background: #7f5af0;
}

@media (max-width: 500px) {
  .modal-grid {
    grid-template-columns: auto;
  }
}
</style>
<script>
import { state } from '@/store.js'

export default {
  name: 'CharacterSelect',
  props: {
    characters: { type: Array, default: null },
    val: { type: String, default: "" }
  },
  computed: {
    state() {
      return state
    },
    charactersList() {
      if (this.characters) {
        return this.characters
      }
      return state.games.find((g) => g.id === this.$route.params.id).characters
    },
  },
  data() {
    return {
      character: this.val,
      error: false,
    }
  },
  methods: {
    validate() {
      return this.character !== ''
    },
    edit(char_id) {
      this.$emit('char_edit', char_id)
    },
    createCharacter() {
      this.$emit('create_character')
    },
    edited() {
      this.$emit('edited')
    },
  },
}
</script>

<template>
  <div class="character-item-container">
    <select
      type="text"
      @change="edited"
      :class="{ error: this.error }"
      v-model="this.character"
      class="input"
    >
      <option value="">Выбрать персонажа</option>
      <option v-for="char of charactersList" :value="char.id">{{ char.name }}</option>
    </select>
    <span class="create-character" @click="createCharacter">+</span>
    <span class="error-label" v-if="this.error">Это поле обязательно для заполнения</span>
    <!-- Раскомментируйте, если нужна иконка редактирования -->
    <!-- <img src="/assets/edit.png" class="character-item-edit" @click="edit(this.character)" /> -->
  </div>
</template>

<style scoped>
.character-item-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 12px 16px;
  background: #f8f0ff;
  border: 1px solid #b392ff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(171, 114, 231, 0.2);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.dark-theme .character-item-container {
  background: #2c2a4a;
  border-color: #5b4cb8;
  box-shadow: 0 4px 16px rgba(90, 79, 207, 0.3);
}

.character-item-container:hover {
  box-shadow: 0 6px 20px rgba(171, 114, 231, 0.3);
  border-color: #9f8cff;
}

.dark-theme .character-item-container:hover {
  box-shadow: 0 6px 20px rgba(90, 79, 207, 0.4);
  border-color: #8a7cff; 
}

.input {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #b392ff;
  padding: 8px 12px;
  font-size: 16px;
  background: #fff1ff;
  color: #4a2670;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.dark-theme .input {
  background: #3c3a5e;
  color: #e8e4ff;
  border-color: #5b4cb8;
}

.input:focus {
  border-color: #9f8cff;
}

.dark-theme .input:focus {
  border-color: #8a7cff;
}

.input.error {
  border-color: #e57373;
}

.dark-theme .input.error {
  border-color: #cf6679;
}

.create-character {
  font-size: 24px;
  color: #7b3fe4;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f1e3ff;
  transition: background 0.2s, color 0.2s;
}

.dark-theme .create-character {
  color: #e8e4ff;
  background: #3c3a5e;
}

.create-character:hover {
  background: #e0d7ff;
  color: #9f8cff;
}

.dark-theme .create-character:hover {
  background: #5b4cb8;
  color: #8a7cff;
}

.error-label {
  font-size: 14px;
  color: #e57373;
  margin-left: 8px;
}

.dark-theme .error-label {
  color: #cf6679;
}

.character-item-edit {
  height: 20px;
  width: auto;
  cursor: pointer;
  filter: brightness(1);
  transition: filter 0.2s;
}

.dark-theme .character-item-edit {
  filter: brightness(1.5) hue-rotate(10deg);
}

.character-item-edit:hover {
  filter: brightness(1.2);
}

.dark-theme .character-item-edit:hover {
  filter: brightness(1.8) hue-rotate(10deg);
}
</style>
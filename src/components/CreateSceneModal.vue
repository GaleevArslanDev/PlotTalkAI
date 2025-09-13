<script lang="ts">
import CharacterItem from '@/components/CharacterItem.vue'
import Scrollview from '@/components/Scrollview.vue'
import { state } from './../store'

export default {
  name: 'CreateSceneModal',
  components: { Scrollview, CharacterItem },
  props: {
    sceneData: { type: Object, default: null },
  },
  data() {
    return {
      name: '',
      characters: [],
      description: '',
      fieldsToValidate: ['name', 'description', 'characters'],
      errors: {
        name: false,
        description: false,
        characters: false,
      },
    }
  },
  watch: {
    sceneData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.name = val.name || ''
          this.description = val.description || ''
          if (val.characters) {
            this.characters = [...val.characters]
          }
        }
      },
    },
  },
  computed: {
    charactersList() {
      const game = state.games.find((g) => g.id === state.selectedGameId)
      return game ? game.characters : []
    },
  },
  methods: {
    validate() {
      this.resetErrors()
      const errors = []

      const fieldLabels = {
        name: 'Название',
        characters: 'Персонажи',
        description: 'Характеристики сцены',
      }

      for (const field of this.fieldsToValidate) {
        const value = this[field]

        if (field === 'characters') {
          if (value.length === 0) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
            this.errors[field] = true
          }
        } else if (typeof value === 'string') {
          if (!value.trim()) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
            this.errors[field] = true
          }
        } else if (value === null || value === undefined || value === 0) {
          errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
            this.errors[field] = true
        }
      }
      return !errors.length
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false
      }
    },
    editCharacters() {
      console.log(state.selectedGameId);
      this.$emit("editCharacters", state.games.find(g => g.id === state.selectedGameId))
    }
  },
}
</script>

<template>
  <div class="create-scene-modal-container">
    <div class="create-scene-modal-cell create-scene-modal-name">
      <h2 class="create-scene-modal-h2 create-scene-modal-name-text">Название</h2>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :class="{ error: errors.name }" />
        <span class="error-label" v-if="errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="create-scene-modal-cell create-scene-modal-description">
      <h2 class="create-scene-modal-h2">Характеристика сцены</h2>
      <textarea
        class="input create-scene-modal-textarea-input"
        v-model="description"
        :class="{ error: errors.description }"
      />
      <span class="error-label" v-if="errors.description">Это поле обязательно для заполнения</span>
    </div>
    <div class="create-scene-modal-cell create-scene-modal-characters">
      <h2 class="create-scene-modal-h2">Персонажи <button class="btn" type="button" @click="editCharacters">Изменить</button></h2>
      <Scrollview :w="'100%'" :h="'200px'" :class="{ error: errors.characters }">
        <ul class="characters-list">
          <li v-for="char of charactersList" :key="char.id" class="character-checkbox">
            <label>
              <input type="checkbox" :value="char.id" v-model="characters" />
              <span>{{ char.name }}</span>
            </label>
          </li>
        </ul>
      </Scrollview>
      <span class="error-label" v-if="errors.characters">Это поле обязательно для заполнения</span>
    </div>
  </div>
</template>

<style scoped>
.create-scene-modal-container {
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: auto auto;
  width: 100%;
  height: 100%;
  gap: 20px;
  background: #f8f0ff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(171, 114, 231, 0.2);
  transition: background 0.2s, box-shadow 0.2s;
}

.dark-theme .create-scene-modal-container {
  background: #2c2a4a;
  box-shadow: 0 4px 16px rgba(90, 79, 207, 0.3);
}

.create-scene-modal-cell {
  justify-self: left;
  width: 100%;
  justify-content: left;
  text-align: left;
}

.create-scene-modal-name {
  grid-column: span 2;
  display: flex;
  align-items: center;
}

.create-scene-modal-h2 {
  text-align: left;
  font-weight: normal;
  margin-right: 5px;
  margin-top: 0;
  font-size: 18px;
  color: #7b3fe4;
  transition: color 0.2s;
}

.dark-theme .create-scene-modal-h2 {
  color: #e8e4ff;
}

.create-scene-modal-name-text {
  margin-top: 0.75em;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input {
  border-radius: 8px;
  border: 1px solid #b392ff;
  padding: 8px 12px;
  font-size: 16px;
  background: #fff1ff;
  color: #4a2670;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  resize: none;
  width: calc(100% - 6px);
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

.create-scene-modal-textarea-input {
  min-height: 100px;
  height: calc(100% - 80px);
}

.error-label {
  font-size: 14px;
  color: #e57373;
  margin-top: 4px;
  text-align: left;
}

.dark-theme .error-label {
  color: #cf6679;
}

.characters-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.character-checkbox {
  background-color: #fff1ff;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 3px rgba(171, 114, 231, 0.1);
}

.dark-theme .character-checkbox {
  background-color: #3c3a5e;
  box-shadow: 0 1px 3px rgba(90, 79, 207, 0.2);
}

.character-checkbox:hover {
  background-color: #e0d7ff;
}

.dark-theme .character-checkbox:hover {
  background-color: #5b4cb8;
}

.character-checkbox input[type='checkbox'] {
  margin-right: 8px;
  transform: scale(1.2);
  cursor: pointer;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #b392ff;
  border-radius: 4px;
  background: #fff1ff;
  transition: border-color 0.2s, background 0.2s;
}

.dark-theme .character-checkbox input[type='checkbox'] {
  border-color: #5b4cb8;
  background: #3c3a5e;
}

.character-checkbox input[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20' stroke='%237b3fe4' fill='%237b3fe4'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.dark-theme .character-checkbox input[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20' stroke='%239f8cff' fill='%239f8cff'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
}

.character-checkbox span {
  font-size: 14px;
  font-weight: 500;
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .character-checkbox span {
  color: #e8e4ff;
}

.btn {
  background: linear-gradient(90deg, #b392ff 20%, #d9e4ff 100%);
  color: #4a2670;
  border: none;
  border-radius: 7px;
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(171, 114, 231, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .btn {
  background: linear-gradient(90deg, #5b4cb8 20%, #8a7cff 100%);
  color: #e8e4ff;
  box-shadow: 0 2px 10px rgba(90, 79, 207, 0.4);
}

.btn:hover {
  background: #e0d7ff;
  transform: scale(1.04);
}

.dark-theme .btn:hover {
  background: #6f61d0;
}

@media (max-width: 480px) {
  .create-scene-modal-container {
    grid-template-columns: auto;
    grid-template-rows: repeat(3, auto);
  }
  .create-scene-modal-name {
    grid-column: auto;
  }
}
</style>
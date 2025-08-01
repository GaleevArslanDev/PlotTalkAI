﻿<script lang="ts">
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
        <input class="input" type="text" v-model="name" :class="{ error: this.errors.name }" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="create-scene-modal-cell create-scene-modal-description">
      <h2 class="create-scene-modal-h2">Характеристика сцены</h2>
      <textarea
        class="input create-scene-modal-textarea-input"
        v-model="description"
        :class="{ error: this.errors.description }"
      />
      <span class="error-label" v-if="this.errors.description"
        >Это поле обязательно для заполнения</span
      >
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
      <span class="error-label" v-if="this.errors.characters"
        >Это поле обязательно для заполнения</span
      >
    </div>
  </div>
</template>

<style scoped>
.characters-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.character-checkbox {
  background-color: #f8f9fa;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.character-checkbox:hover {
  background-color: #eef1f4;
}

.character-checkbox input[type='checkbox'] {
  margin-right: 8px;
  transform: scale(1.2);
  cursor: pointer;
}

.character-checkbox span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.create-scene-modal-container {
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: auto auto;
  width: 100%;
  height: 100%;
  grid-gap: 20px;
}
.create-scene-modal-name {
  grid-column: span 2;
  display: flex;
  align-items: center;
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
.create-scene-modal-h2 {
  text-align: left;
  font-weight: normal;
  margin-right: 5px;
  margin-top: 0;
}
.create-scene-modal-cell {
  justify-self: left;
  width: 100%;
  justify-content: left;
  text-align: left;
}
.input-wrapper {
  display: flex;
  flex-direction: column;
}
.create-scene-modal-name-text {
  margin-top: 0.75em;
}
.create-scene-modal-textarea-input {
  min-height: 100px;
  height: calc(100% - 80px);
  resize: none;
  width: calc(100% - 6px);
}
.add-btn {
  cursor: pointer;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
}
</style>

<script>
import Checkbox from "@/components/Checkbox.vue";
export default {
  name: "PlayerGetsSettings",
  props: ['checkbox', 'input', 'val'],
  components: {
    Checkbox
  },
  methods: {
    validate() {
      this.resetErrors();
      if (!this.gets) {
        return true; // Если чекбокс не отмечен, валидация проходит
      }

      const errors = [];
      const fieldLabels = {
        'name': 'Название ' + this.checkbox,
        'condition': 'Условие достижения ' + this.checkbox
      };

      for (const field of this.fieldsToValidate) {
        const value = this[field];

        if (typeof value === 'string') {
          if (!value.trim()) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
            this.errors[field] = true;
          }
        } else if (value === null || value === undefined) {
          errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
          this.errors[field] = true;
        }
      }

      return errors.length === 0;
    },

    getFormData() {
      return {
        gets: this.gets,
        name: this.name,
        condition: this.condition
      };
    },

    checkboxChanged(value) {
      this.gets = value;
      if (!value) {
        this.name = '';
        this.condition = '';
        this.resetErrors();
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false;
      }
    }
  },
  data(){
    return {
      gets: this.val?.gets,
      name: this.val?.name,
      condition: this.val?.condition,
      fieldsToValidate: ['name', 'condition'],
      errors: {
        name: false,
        condition: false
      }
    };
  }
}
</script>

<template>
  <div class="player-gets-settings">
    <Checkbox :id="checkbox" :label="'Персонаж получит '+checkbox" :value="gets" @onChange="checkboxChanged"/>
    <div class="player-gets-settings-name-input" :class="{'gray': !this.gets}">
      <span class="player-gets-settings-name-label label">{{ input }}</span>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :disabled="!gets" :class="{error: this.errors.name}" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="player-gets-settings-condition-input" :class="{gray: !this.gets}">
      <span class="player-gets-settings-condition-label">Условие достижения</span>
      <div class="input-wrapper">
        <input class="input player-gets-settings-condition-input-field" type="text" v-model="condition" :disabled="!gets" :class="{error: this.errors.condition}" />
        <span class="error-label" v-if="this.errors.condition">Это поле обязательно для заполнения</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-gets-settings {
  background: #f8f0ff;
  padding: 16px;
  border-radius: 8px;
  color: #4a2670;
  transition: background 0.2s, color 0.2s;
}

.dark-theme .player-gets-settings {
  background: #2c2a4a;
  color: #e8e4ff;
}

.gray > * {
  border-color: #a5a5a5;
  color: #a5a5a5;
  pointer-events: none;
}

.dark-theme .gray > * {
  border-color: #6b7280;
  color: #6b7280;
}

.player-gets-settings-name-input {
  margin-top: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-gets-settings-condition-input {
  margin-top: 7px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  text-align: left;
}

.player-gets-settings-condition-label,
.player-gets-settings-name-label {
  font-size: 0.9rem;
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .player-gets-settings-condition-label,
.dark-theme .player-gets-settings-name-label {
  color: #e8e4ff;
}

.player-gets-settings-condition-label {
  margin-bottom: 5px;
}

.player-gets-settings-condition-input-field {
  width: auto;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input {
  padding: 8px;
  border: 1px solid #b392ff;
  border-radius: 4px;
  background: #fff1ff;
  color: #4a2670;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.dark-theme .input {
  border-color: #5b4cb8;
  background: #3c3a5e;
  color: #e8e4ff;
}

.input.error {
  border-color: #e57373;
}

.dark-theme .input.error {
  border-color: #cf6679;
}

.error-label {
  color: #e57373;
  font-size: 0.8rem;
  margin-top: 4px;
  transition: color 0.2s;
}

.dark-theme .error-label {
  color: #cf6679;
}
</style>
<script>
import Scrollview from '@/components/Scrollview.vue';
import CharacterItem from '@/components/CharacterItem.vue';
import PlayerGetsSettings from '@/components/PlayerGetsSettings.vue';
import CharacterSelect from '@/components/CharacterSelect.vue';
import { state } from '@/store';

export default {
  name: 'CreateScriptModal',
  components: { CharacterSelect, CharacterItem, Scrollview, PlayerGetsSettings },
  props: {
    scene: { type: Object, default: null },
    edit: { type: String, default: "false" },
    script: { type: Object, default: null },
  },
  data() {
    return {
      name: this.edit === 'false' ? "" : this.script?.name,
      answers_from_m: this.edit === 'false' ? 1 : this.script?.answers_from_m,
      answers_to_m: this.edit === 'false' ? 1 : this.script?.answers_to_m,
      answers_from_n: this.edit === 'false' ? 1 : this.script?.answers_from_n,
      answers_to_n: this.edit === 'false' ? 1 : this.script?.answers_to_n,
      main_character: this.edit === 'false' ? "" : this.script?.main_character,
      to_npc_relations: this.edit === 'false' ? 'не знаком' : this.script?.to_npc_relations,
      npc: this.edit === 'false' ? "" : this.script?.npc,
      to_main_character_relations: this.edit === 'false' ? 'не знаком' : this.script?.to_main_character_relations,
      description: this.edit === 'false' ? '' : this.script?.description,
      itemData: this.edit === 'false' ? {} : this.script?.itemData,
      infoData: this.edit === 'false' ? {} : this.script?.infoData,
      additional: this.edit === 'false' ? '' : this.script?.additional,
      fieldsToValidate: ['name', 'main_character', 'npc', 'description'],
      errors: {
        name: false,
        answers_count: false,
        branches_count: false,
        characters: false,
        description: false,
        main_character: false,
        npc: false,
      },
    };
  },
  computed: {
    availableCharacters() {
      if (!this.scene) return [];
      const game = state.games.find((g) => g.id === state.selectedGameId);
      return game ? game.characters.filter((c) => this.scene.characters.includes(c.id)) : [];
    },
  },
  methods: {
    validate() {
      this.resetErrors();
      if (
        this.$refs.playerGetsSettingsItem &&
        this.$refs.playerGetsSettingsItem.validate() &&
        this.$refs.playerGetsSettingsInfo &&
        this.$refs.playerGetsSettingsInfo.validate()
      ) {
        this.itemData = this.$refs.playerGetsSettingsItem.getFormData();
        this.infoData = this.$refs.playerGetsSettingsInfo.getFormData();
        const errors = [];

        const fieldLabels = {
          name: 'Название',
          answers_count: 'Количество ответов',
          branches_count: 'Количество сюжетных веток',
          characters: 'Персонажи',
          description: 'Краткое содержание',
        };

        for (const field of this.fieldsToValidate) {
          const value = this[field];
          if (typeof value === 'object') {
            if (Object.keys(value).length === 0) {
              errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
              this.errors[field] = true;
            }
          } else if (typeof value === 'string') {
            if (!value.trim()) {
              errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
              this.errors[field] = true;
            }
          } else if (value === null || value === undefined || value === 0) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
            this.errors[field] = true;
          }
        }

        return !errors.length;
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false;
      }
    },
    npcEdited() {
      this.npc = this.$refs.npc.character;
    },
    mainCharacterEdited() {
      this.main_character = this.$refs.main_char.character;
    },
  },
};
</script>

<template>
  <div class="create-script-modal-container">
    <div class="create-script-modal-cell create-script-modal-name">
      <h2 class="create-script-modal-h2 create-script-modal-name-text">Название</h2>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :class="{ error: errors.name }" />
        <span class="error-label" v-if="errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-count">
      <div class="create-script-modal-count-answers">
        <div class="create-script-modal-count-branches">
          <label class="label" for="create-script-modal-count-answers-input">Ответы главного персонажа:</label>
          <span class="label">от</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_from_m"
            min="1"
            max="1000"
            :class="{ error: errors.answers_count }"
          />
          <span class="label">до</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_to_m"
            min="1"
            max="1000"
            :class="{ error: errors.answers_count }"
          />
        </div>
      </div>
      <div class="create-script-modal-count-answers">
        <div class="create-script-modal-count-answers">
          <label class="label" for="create-script-modal-count-answers-input">Глубина дерева диалогов:</label>
          <span class="label">от</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_from_n"
            min="1"
            max="1000"
            :class="{ error: errors.branches_count }"
          />
          <span class="label">до</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_to_n"
            min="1"
            max="1000"
            :class="{ error: errors.branches_count }"
          />
        </div>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-characters">
      <h2 class="create-script-modal-h2">Персонажи</h2>
      <p class="label"><b>Главный персонаж</b></p>
      <CharacterSelect
        ref="main_char"
        :characters="availableCharacters"
        @edited="mainCharacterEdited"
        :val="main_character"
        :class="{ error: errors.main_character }"
      />
      <span class="error-label" v-if="errors.main_character">Это поле обязательно для заполнения</span>
      <div class="create-script-modal-name">
        <span class="label">Отношение к NPC</span>
        <select
          class="input"
          style="float: right; width: max-content; margin-left: 2px"
          v-model="to_npc_relations"
          :class="{ error: errors.to_npc_relations }"
        >
          <option value="не знаком">Не знаком</option>
          <option value="хорошо">Хорошо</option>
          <option value="нейтрально">Нейтрально</option>
          <option value="плохо">Плохо</option>
        </select>
      </div>
      <p class="label"><b>NPC</b></p>
      <CharacterSelect
        ref="npc"
        :characters="availableCharacters"
        @edited="npcEdited"
        :val="npc"
        :class="{ error: errors.npc }"
      />
      <span class="error-label" v-if="errors.npc">Это поле обязательно для заполнения</span>
      <div class="create-script-modal-name">
        <span class="label">Отношение к главному персонажу</span>
        <select
          class="input"
          style="float: right; width: max-content; margin-left: 2px"
          v-model="to_main_character_relations"
          :class="{ error: errors.to_main_character_relations }"
        >
          <option value="не знаком">Не знаком</option>
          <option value="хорошо">Хорошо</option>
          <option value="нейтрально">Нейтрально</option>
          <option value="плохо">Плохо</option>
        </select>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-description">
      <h2 class="create-script-modal-h2">Краткое содержание</h2>
      <textarea
        class="input create-script-modal-description-input"
        v-model="description"
        :class="{ error: errors.description }"
      />
      <span class="error-label" v-if="errors.description">Это поле обязательно для заполнения</span>
    </div>
    <div class="create-script-modal-cell create-script-modal-getting-item">
      <PlayerGetsSettings :checkbox="'предмет'" :input="'Предмет'" ref="playerGetsSettingsItem" :val="itemData" />
    </div>
    <div class="create-script-modal-cell create-script-modal-getting-info">
      <PlayerGetsSettings
        :checkbox="'информацию'"
        :input="'Информация'"
        ref="playerGetsSettingsInfo"
        :val="infoData"
      />
    </div>
    <div class="create-script-modal-cell create-script-modal-additional">
      <h2 class="create-script-modal-h2">Дополнительно</h2>
      <textarea class="input create-script-modal-additional-input" v-model="additional" />
    </div>
  </div>
</template>

<style scoped>
.create-script-modal-container {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: repeat(4, auto);
  width: 100%;
  gap: 10px;
  background: #f8f0ff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(171, 114, 231, 0.2);
  transition: background 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.dark-theme .create-script-modal-container {
  background: #2c2a4a;
  box-shadow: 0 4px 16px rgba(90, 79, 207, 0.3);
}

.create-script-modal-cell {
  justify-self: left;
  width: 100%;
  justify-content: left;
  text-align: left;
}

.create-script-modal-name {
  display: flex;
  align-items: center;
}

.create-script-modal-h2 {
  text-align: left;
  font-weight: normal;
  margin-right: 5px;
  margin-top: 0;
  font-size: 18px;
  color: #7b3fe4;
  transition: color 0.2s;
}

.dark-theme .create-script-modal-h2 {
  color: #e8e4ff;
}

.create-script-modal-name-text {
  margin-top: 0.75em;
}

.create-script-modal-description {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.create-script-modal-description-input {
  height: 100%;
  resize: none;
}

.create-script-modal-additional-input {
  height: 75px;
  resize: none;
  width: calc(100% - 6px);
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
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.dark-theme .input {
  background: #3c3a5e;
  color: #e8e4ff;
  border-color: #5b4cb8;
}

.input:focus {
  border-color: #9f8cff;
  box-shadow: 0 0 0 1px #9f8cff;
}

.dark-theme .input:focus {
  border-color: #8a7cff;
  box-shadow: 0 0 0 1px #8a7cff;
}

.input.error {
  border-color: #e57373;
}

.dark-theme .input.error {
  border-color: #cf6679;
}

.number-input {
  width: 60px;
  text-align: center;
}

.create-script-modal-count-answers {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.label {
  font-size: 14px;
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .label {
  color: #e8e4ff;
}

.create-script-modal-count-branches {
  display: flex;
  align-items: center;
  gap: 8px;
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

.create-script-modal-additional {
  grid-column: span 2;
  width: 100%;
}

@media (max-width: 480px) {
  .create-script-modal-container {
    grid-template-columns: auto;
    grid-template-rows: repeat(7, auto);
  }
  .create-script-modal-additional {
    grid-column: auto;
  }
}
</style>

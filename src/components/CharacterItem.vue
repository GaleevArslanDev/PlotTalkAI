<script>
export default {
  name: "CharacterItem",
  props: {
    character: { type: Object, required: true }, // Добавляем пропс для данных персонажа
  },
  methods: {
    editCharacter() {
      this.$emit('edit', this.character); // Эмитим событие редактирования
    },
    deleteCharacter() {
      this.$emit('delete', this.character); // Эмитим событие удаления
    },
  },
};
</script>

<template>
  <div class="character-item-container">
    <input
      type="text"
      class="input"
      :value="character.name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Имя персонажа"
    >
    <img
      src="/assets/edit.png"
      class="character-item-edit"
      @click="editCharacter"
      title="Редактировать"
    />
    <img
      src="/assets/delete.png"
      class="character-item-load"
      @click="deleteCharacter"
      title="Удалить"
    />
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

.character-item-edit,
.character-item-load {
  height: 20px;
  width: auto;
  cursor: pointer;
  transition: filter 0.2s;
}

.character-item-edit {
  filter: brightness(1);
}

.dark-theme .character-item-edit {
  filter: brightness(1.5) hue-rotate(10deg);
}

.character-item-load {
  filter: brightness(1);
}

.dark-theme .character-item-load {
  filter: brightness(1.5) hue-rotate(10deg);
}

.character-item-edit:hover,
.character-item-load:hover {
  filter: brightness(1.2);
}

.dark-theme .character-item-edit:hover,
.dark-theme .character-item-load:hover {
  filter: brightness(1.8) hue-rotate(10deg);
}
</style>
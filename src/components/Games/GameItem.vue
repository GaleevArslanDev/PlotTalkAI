﻿<template>
  <div class="game-item" @click="openGame">
    <div class="game-item-actions">
      <button class="icon" @click.stop="editGame" title="Редактировать">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill="#7b3fe4"
            class="icon-fill"
          />
        </svg>
      </button>
      <button class="icon" @click.stop="deleteGame" title="Удалить">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            fill="#7b3fe4"
            class="icon-fill"
          />
        </svg>
      </button>
    </div>
    <div class="game-item-title">
      <svg class="game-icon" width="24" height="24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="#b392ff" stroke-width="2" />
        <path d="M9 15l6-6M9 9h6v6" stroke="#9f8cff" stroke-width="2" />
      </svg>
      {{ game.name }}
    </div>
    <div class="game-meta">
      <span class="game-badge">{{ game.scenes.length }} сцен</span>
      <span class="game-badge">{{ game.characters.length }} персонажей</span>
    </div>
    <div class="game-item-characters" @click.stop="openCharacters">персонажи</div>
  </div>
</template>

<script>
export default {
  name: 'GameItem',
  props: {
    game: { type: Object, required: true },
  },
  methods: {
    openGame() {
      this.$emit('open', this.game);
    },
    openCharacters() {
      this.$emit('chars', this.game);
    },
    editGame() {
      this.$emit('edit', this.game);
    },
    deleteGame() {
      this.$emit('delete', this.game);
    },
  },
};
</script>

<style scoped>
.game-item {
  min-width: 200px;
  min-height: 210px;
  background: linear-gradient(180deg, #f8f0ff 70%, #ffffff 100%);
  border: 2px solid #b392ff;
  border-radius: 19px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(171, 114, 231, 0.3);
  transition: box-shadow 0.23s, transform 0.13s, border-color 0.23s;
  position: relative;
}

.dark-theme .game-item {
  background: linear-gradient(180deg, #2c2a4a 70%, #1e1b2e 100%);
  border-color: #5b4cb8;
  box-shadow: 0 6px 24px rgba(90, 79, 207, 0.4);
}

.game-item:hover {
  box-shadow: 0 12px 32px rgba(171, 114, 231, 0.4);
  transform: translateY(-2px) scale(1.02);
  border-color: #9f8cff;
}

.dark-theme .game-item:hover {
  box-shadow: 0 12px 32px rgba(90, 79, 207, 0.5);
  border-color: #8a7cff;
}

.game-item-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 6px;
}

.icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
}

.dark-theme .icon .icon-fill {
  fill: #9f8cff;
}

.game-item-title {
  font-size: 20px;
  color: #7b3fe4;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 22px 18px 2px 18px;
  text-shadow: 0 1px 10px rgba(171, 114, 231, 0.2);
}

.dark-theme .game-item-title {
  color: #e8e4ff;
  text-shadow: 0 1px 10px rgba(90, 79, 207, 0.3);
}

.game-icon circle {
  stroke: #b392ff;
}

.game-icon path {
  stroke: #9f8cff;
}

.dark-theme .game-icon circle {
  stroke: #5b4cb8;
}

.dark-theme .game-icon path {
  stroke: #8a7cff;
}

.game-meta {
  display: flex;
  gap: 10px;
  padding: 0 18px 0 18px;
  margin: 6px 0 0 0;
}

.game-badge {
  background: #f1e3ff;
  color: #7b3fe4;
  border-radius: 7px;
  font-size: 13px;
  padding: 2px 8px;
  margin-top: 3px;
  font-weight: 500;
}

.dark-theme .game-badge {
  background: #3c3a5e;
  color: #e8e4ff;
}

.game-item-characters {
  border-top: 2px solid #b392ff;
  text-align: left;
  padding: 12px 18px;
  font-size: 16px;
  color: #7b3fe4;
  background: #f8f0ff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.15s;
}

.dark-theme .game-item-characters {
  border-top-color: #5b4cb8;
  color: #e8e4ff;
  background: #2c2a4a;
}

.game-item-characters:hover {
  background: #e0d7ff;
}

.dark-theme .game-item-characters:hover {
  background: #3c3a5e;
}
</style>
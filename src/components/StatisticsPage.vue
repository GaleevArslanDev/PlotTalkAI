<template>
  <div class="stats-page">
    <div class="header-container">
      <button class="back-button" @click="goBack">← Назад</button>
      <h1>Статистика</h1>
    </div>
    
    <section class="overall">
      <h2>Общая информация</h2>
      <div class="stats-container">
        <div class="stat-item"><strong>Игр:</strong> {{ totalGames }}</div>
        <div class="stat-item"><strong>Сцен:</strong> {{ totalScenes }}</div>
        <div class="stat-item"><strong>Сценариев:</strong> {{ totalScripts }}</div>
        <div class="stat-item"><strong>Персонажей:</strong> {{ totalCharacters }}</div>
        <div class="stat-item">
          <strong>Активность пользователей:</strong> {{ logsCount }} событий
        </div>
      </div>
    </section>
    <section v-for="game in state.games" :key="game.id" class="game-section">
      <h2>{{ game.name }}</h2>
      <div class="stats-container">
        <div class="stat-item"><strong>Сцен:</strong> {{ game.scenes?.length || 0 }}</div>
        <div class="stat-item"><strong>Сценариев:</strong> {{ gameScripts(game) }}</div>
        <div class="stat-item"><strong>Персонажей:</strong> {{ game.characters?.length || 0 }}</div>
        <div class="stat-item"><strong>Завершено:</strong> {{ getGameProgress(game) }}%</div>
      </div>
    </section>
  </div>
</template>

<script>
import { state } from '@/store';
import logger from '@/logger';

export default {
  name: 'StatisticsPage',
  computed: {
    state() {
      return state;
    },
    logsCount() {
      return logger.logs.length;
    },
    totalGames() {
      return state.games.length;
    },
    totalScenes() {
      let count = 0;
      state.games.forEach((g) => {
        count += g.scenes?.length || 0;
      });
      return count;
    },
    totalScripts() {
      let count = 0;
      state.games.forEach((g) => {
        g.scenes?.forEach((s) => {
          count += s.scripts?.length || 0;
        });
      });
      return count;
    },
    totalCharacters() {
      let count = 0;
      state.games.forEach((g) => {
        count += g.characters?.length || 0;
      });
      return count;
    },
  },
  methods: {
    gameScripts(game) {
      let count = 0;
      game.scenes?.forEach((s) => {
        count += s.scripts?.length || 0;
      });
      return count;
    },
    getGameProgress(game) {
      if (!game.scenes || game.scenes.length === 0) return 0;
      const completed = game.scenes.filter((s) => (s.scripts?.length || 0) > 0).length;
      return Math.round((completed / game.scenes.length) * 100);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.stats-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #f8f0ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(171, 114, 231, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  color: #4a2670;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.dark-theme .stats-page {
  background: #2c2a4a;
  color: #e8e4ff;
  box-shadow: 0 4px 12px rgba(90, 79, 207, 0.2);
}

.header-container {
  position: relative;
  margin-bottom: 30px;
  text-align: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid #b392ff;
  color: #7b3fe4;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.dark-theme .back-button {
  border-color: #5b4cb8;
  color: #9f8cff;
}

.back-button:hover {
  background: #e0d7ff;
  border-color: #9f8cff;
}

.dark-theme .back-button:hover {
  background: #6f61d0;
  border-color: #8a7cff;
}

.stats-page h1 {
  margin: 0;
  font-size: 2rem;
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .stats-page h1 {
  color: #e8e4ff;
}

.stats-page h2 {
  margin: 25px 0 15px;
  font-size: 1.4rem;
  color: #7b3fe4;
  transition: color 0.2s;
}

.dark-theme .stats-page h2 {
  color: #e8e4ff;
}

.stats-container {
  background: #fff1ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  transition: background 0.2s;
}

.dark-theme .stats-container {
  background: #3c3a5e;
}

.stat-item {
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(171, 114, 231, 0.05);
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  transition: background 0.2s, box-shadow 0.2s;
}

.dark-theme .stat-item {
  background: #4a466e;
  box-shadow: 0 2px 4px rgba(90, 79, 207, 0.2);
}

.stat-item strong {
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .stat-item strong {
  color: #e8e4ff;
}

.stats-page::-webkit-scrollbar {
  width: 8px;
}

.stats-page::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .stats-page::-webkit-scrollbar-track {
  background: #3c3a5e;
}

.stats-page::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background 0.2s;
}

.dark-theme .stats-page::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.stats-page::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.dark-theme .stats-page::-webkit-scrollbar-thumb:hover {
  background: #8a7cff;
}
</style>
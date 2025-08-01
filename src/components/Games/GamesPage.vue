﻿<template>
  <div class="games-dashboard">
    <!-- Top bar -->
    <header class="dashboard-header">
      <div class="dashboard-user">
        <svg class="user-avatar-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7c37a5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        <span class="user-name">{{ username }}</span>
      </div>

      <div class="dashboard-status">
        {{ $t('games.total') }}: <b>{{ state.games.length }}</b>
      </div>
      
      <div class="header-actions">
        <button class="dashboard-settings" :title="$t('settings.title')" @click="showSettings = true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a60d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <router-link to="/stats" class="dashboard-stats" :title="$t('stats.title')">
          <svg width="26" height="26" fill="none">
            <path d="M6 18V10M12 18V6M18 18v-4" stroke="#9a60d6" stroke-width="2" stroke-linecap="round" />
          </svg>
        </router-link>

        <button class="logout-button" @click="logoutL" :title="$t('common.logout')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c48e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Cards grid -->
    <main class="games-list">
      <div class="game-item add-game-item" @click="openCreateModal">
        <div class="add-icon">+</div>
        <div class="add-label">{{ $t('games.create') }}</div>
      </div>
      <GameItem
        v-for="game in state.games"
        :key="game.id"
        :game="game"
        @open="openGame"
        @chars="openCharacters"
        @edit="editGame"
        @delete="removeGame"
      />
    </main>

    <!-- Settings Panel + Overlay -->
    <div v-if="showSettings" class="settings-overlay" @click.self="closeSettings">
      <aside class="settings-panel">
        <button class="settings-close" @click="closeSettings" :title="$t('common.close')">×</button>
        <h2 class="settings-title">{{ $t('settings.title') }}</h2>
        <div class="settings-content">
          <div class="setting-item">
            <label>
              <span>{{ $t('settings.darkTheme') }}</span>
              <input type="checkbox" v-model="darkTheme" />
            </label>
          </div>
          <!-- Добавь свои настройки тут -->
          <div class="setting-item">
            <label>
              <span>{{ $t('settings.language') }}</span>
              <select class="input" v-model="language">
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
          <div class="setting-item">
            <label>
              <span>Голос озвучки</span>
              <select class="input" v-model="selectedVoiceName">
                <option v-for="v in voices" :key="v.name" :value="v.name">
                  {{ v.name }} ({{ v.lang }})
                </option>
              </select>
            </label>
          </div>
        </div>
      </aside>
    </div>

    <!-- Modal -->
    <CreateGameModal
      v-if="showCreateModal"
      :gameData="editingGame"
      :showDelete="Boolean(editingGame)"
      @close="closeGameModal"
      @save="saveGame"
      @delete="deleteGame"
      ref="createGame"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { fetchData, logout } from '../../../api/api'
</script>

<script>
import GameItem from '@/components/Games/GameItem.vue'
import CreateGameModal from '@/components/Games/CreateGameModal.vue'
import { state, saveState } from '@/store'
import ModalWindow from '../ModalWindow.vue'
let r = useRouter();
export default {
  components: { GameItem, CreateGameModal, ModalWindow },
  data() {
    return {
      showCreateModal: false,
      editingGame: null,
      showSettings: false,
      darkTheme: false,
      language: 'ru',
      voices: [],
      selectedVoiceName: '',
      selectedGameCharacters: [],
      showUserMenu: false,
      username: ''
    }
  },
  computed: {
    state() {
      return state
    },
  },
  watch: {
    darkTheme(val) {
      document.body.classList.toggle('dark-theme', val)
      localStorage.setItem('darkTheme', val ? '1' : '0')
    },
    language(val) {
      this.$i18n.locale = val
      localStorage.setItem('locale', val)
    },
    selectedVoiceName(val) {
      localStorage.setItem('voiceName', val)
    },
  },
  mounted() {
    this.darkTheme = localStorage.getItem('darkTheme') === '1'
    document.body.classList.toggle('dark-theme', this.darkTheme)
    this.language = this.$i18n.locale
    this.selectedVoiceName = localStorage.getItem('voiceName') || ''
    this.updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', this.updateVoices)
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.username = user.name + " " + user.surname;
  },
  beforeUnmount() {
    window.speechSynthesis.removeEventListener('voiceschanged', this.updateVoices)
  },
  methods: {
    openCharacters(game) {
      this.$parent.$parent.openCharacters(game)
    },
    updateVoices() {
      this.voices = window.speechSynthesis.getVoices()
      if (!this.selectedVoiceName && this.voices.length) {
        const def = this.voices.find((v) => v.default) || this.voices[0]
        this.selectedVoiceName = def?.name || ''
      }
    },
    openCreateModal() {
      this.editingGame = null
      this.showCreateModal = true
    },
    editGame(game) {
      this.editingGame = { ...game }
      this.showCreateModal = true
    },
    saveGame(game) {
      if (this.editingGame) {
        const idx = state.games.findIndex((g) => g.id === this.editingGame.id)
        if (idx !== -1) {
          state.games[idx] = { ...state.games[idx], ...game }
        }
      } else {
        state.games.push({ id: Date.now().toString(), ...game, scenes: [], characters: [] })
      }
      saveState()
      this.closeGameModal()
    },
    deleteGame() {
      if (this.editingGame) {
        state.games = state.games.filter((g) => g.id !== this.editingGame.id)
        saveState()
      }
      this.closeGameModal()
    },
    closeGameModal() {
      this.showCreateModal = false
      this.editingGame = null
    },
    openGame(game) {
      this.$router.push('/' + game.id)
    },
    closeSettings() {
      this.showSettings = false
    },
    removeGame(game) {
      state.games = state.games.filter((g) => g.id !== game.id)
      saveState()
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    async logoutL() {
      const res = await logout(); // Ваша функция logout из api.js
      if (res.success) {
        this.$router.push('/login'); // Используем this.$router
      }
      return res;
    }
  },
}
</script>

<style scoped>
.games-dashboard {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  background: linear-gradient(120deg, #e6d5ff 0%, #fff7ff 100%);
  overflow: hidden;
  user-select: none;
}

.dashboard-header {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: 34px 40px 20px 44px;
  background: none;
  font-family: inherit;
  font-size: 1.12rem;
  gap: 25px;
  overflow: hidden; /* Добавлена вертикальная прокрутка */
  max-height: calc(100vh - 120px); /* Ограничение высоты для появления скролла */
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #c4a8f4 #f0e5ff; /* Для Firefox */
}

.dashboard-user {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.user-avatar-icon {
  width: 36px;
  height: 36px;
  padding: 2px;
  border-radius: 50%;
  background: #ebe0fd;
  box-shadow: 0 2px 12px #a78ed03c;
  transition: background 0.2s;
}

.user-name {
  font-size: 22px;
  font-weight: 600;
  color: #7c37a5;
  letter-spacing: 0.2px;
  margin-left: 6px;
}

.dashboard-status {
  color: #814ad9;
  background: #efe6fc;
  border-radius: 13px;
  font-weight: 500;
  font-size: 18px;
  padding: 7px 20px 7px 18px;
  box-shadow: 0 2px 12px #e1d1f622;
  justify-self: center;
}

.dashboard-settings {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9px;
  transition: background 0.16s;
  padding: 7px;
  margin-right: 5px;
}
.dashboard-settings:hover {
  background: #ede1ff;
}
.dashboard-stats {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9px;
  padding: 7px;
  transition: background 0.16s;
  text-decoration: none;
}
.dashboard-stats:hover {
  background: #ede1ff;
}

.games-list {
  overflow-y: auto;
  width: 100%;
  padding: 12px 44px 42px 44px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 34px 28px;
  align-items: flex-start;
  box-sizing: border-box;
}

/* Settings panel styles */
.settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(91, 56, 143, 0.16);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  transition: background 0.2s;
}
.settings-panel {
  width: 340px;
  max-width: 95vw;
  background: #f8f0ff;
  box-shadow: -2px 0 24px #b698f380;
  padding: 30px 30px 20px 26px;
  border-top-left-radius: 26px;
  border-bottom-left-radius: 26px;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideInRight 0.27s cubic-bezier(0.55, 0.06, 0.48, 1.17);
}
@keyframes slideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.settings-close {
  position: absolute;
  top: 19px;
  right: 19px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #b37ee8;
  cursor: pointer;
  transition: color 0.13s;
  z-index: 2;
}
.settings-close:hover {
  color: #a14ed8;
}
.settings-title {
  margin: 0 0 18px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #8246b4;
}
.settings-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.setting-item label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #6f36a5;
  font-weight: 500;
  gap: 18px;
}
.setting-item select,
.setting-item input[type='checkbox'] {
  margin-left: 18px;
}
.add-game-item {
  background: linear-gradient(180deg, #ede1ff 60%, #fff 100%);
  border: 2.7px dashed #b97afa;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  min-width: 200px;
  box-shadow: 0 2px 18px #c9b5eb54;
  cursor: pointer;
  transition:
    box-shadow 0.19s,
    border-color 0.15s,
    transform 0.17s;
  margin: 0;
  position: relative;
}
.add-game-item:hover {
  border-color: #8d32d1;
  box-shadow: 0 7px 32px #b478f66a;
  transform: translateY(-2px) scale(1.04);
}
.add-icon {
  font-size: 56px;
  color: #a35bfd;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 15px;
  text-shadow: 0 3px 18px #be92e455;
}
.add-label {
  font-size: 20px;
  color: #9e3ce4;
  font-weight: 600;
  text-align: center;
}

.games-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.games-list::-webkit-scrollbar-track {
  background: #f0e5ff;
  border-radius: 10px;
}
.games-list::-webkit-scrollbar-thumb {
  background-color: #c4a8f4;
  border-radius: 10px;
  border: 2px solid #f0e5ff;
}
.user-dropdown {
  position: absolute;
  top: 72px;
  left: 44px;
  background: white;
  border: 1px solid #d3bfff;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(137, 98, 199, 0.2);
  padding: 10px 16px;
  z-index: 10;
}
.logout-button {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.logout-button:hover {
  background: #f3ddff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-button {
  background: none;
  border: none;
  padding: 7px;
  cursor: pointer;
  border-radius: 9px;
  transition: background 0.16s;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 500px) {
  .dashboard-header {
    height: 10000000px;
    position: absolute;
    left: 0;
    top: 0;
    grid-template-columns: auto;
    grid-template-rows: repeat(4, 10vh);
    z-index: 100;
    background: linear-gradient(120deg, #e6d5ff 0%, #fff7ff 100%);
    width: 100%;
    justify-content: center;
    align-items: flex-start;
  }
  .header-actions {
    justify-content: center;
  }
}
</style>
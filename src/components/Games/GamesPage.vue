<template>
  <div class="games-dashboard" :class="{ 'dark-theme': darkTheme }">
    <button class="btn" id="show-menu-btn" @click="()=>{isHeader = true}">Открыть меню</button>
    <!-- Top bar -->
    <header class="dashboard-header" v-if="isHeader">
      <span id="close-header" title="Закрыть меню" @click="isHeader = false"><svg width="28" height="28" fill="none"><path d="M7 7l14 14M21 7L7 21" stroke="currentColor" stroke-width="2"/></svg></span>
      <div class="dashboard-user">
        <svg class="user-avatar-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <router-link to="/stats" class="dashboard-stats" :title="$t('stats.title')">
          <svg width="26" height="26" fill="none">
            <path d="M6 18V10M12 18V6M18 18v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </router-link>

        <button class="logout-button" @click="logoutL" :title="$t('common.logout')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <span>{{$t('settings.voice')}}</span>
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
      username: '',
      isHeader: false
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
    this.updateScreenWidth();
    window.addEventListener('resize', () => this.updateScreenWidth());
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
      const res = await logout();
      if (res.success) {
        this.$router.push('/login');
      }
      return res;
    },
    updateScreenWidth() {
      this.$nextTick(() => {
        this.isHeader = window.innerWidth > 499.99;
      });
    },
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
  transition: background 0.3s ease;
}

.dark-theme.games-dashboard {
  background: linear-gradient(120deg, #1e1b2e 0%, #2d2a40 100%);
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
  overflow: hidden;
  max-height: calc(100vh - 120px);
  scrollbar-width: thin;
  scrollbar-color: #c4a8f4 #f0e5ff;
}

.dark-theme .dashboard-header {
  scrollbar-color: #7f5af0 #2a2839;
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

.dark-theme .user-avatar-icon {
  background: #6c5ce7;
  box-shadow: 0 2px 12px rgba(108, 92, 231, 0.25);
}

.user-name {
  font-size: 22px;
  font-weight: 600;
  color: #7c37a5;
  letter-spacing: 0.2px;
  margin-left: 6px;
  transition: color 0.3s ease;
}

.dark-theme .user-name {
  color: #d8d4f2;
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
  transition: all 0.3s ease;
}

.dark-theme .dashboard-status {
  color: #e2def8;
  background: #6c5ce7;
  box-shadow: 0 2px 12px rgba(108, 92, 231, 0.3);
}

.dashboard-settings,
.dashboard-stats,
.logout-button {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9px;
  transition: all 0.16s;
  padding: 7px;
  color: #9a60d6;
}

.dark-theme .dashboard-settings,
.dark-theme .dashboard-stats,
.dark-theme .logout-button {
  color: #a594f9;
}

.dashboard-settings:hover,
.dashboard-stats:hover,
.logout-button:hover {
  background: #ede1ff;
}

.dark-theme .dashboard-settings:hover,
.dark-theme .dashboard-stats:hover,
.dark-theme .logout-button:hover {
  background: #5a4fcf;
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

.dark-theme .settings-overlay {
  background: rgba(30, 27, 46, 0.85);
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
  transition: all 0.3s ease;
}

.dark-theme .settings-panel {
  background: #3a3560;
  box-shadow: -2px 0 24px rgba(90, 79, 207, 0.25);
  color: #e2def8;
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

.dark-theme .settings-close {
  color: #a594f9;
}

.settings-close:hover {
  color: #a14ed8;
}

.dark-theme .settings-close:hover {
  color: #d8d4f2;
}

.settings-title {
  margin: 0 0 18px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #8246b4;
  transition: color 0.3s ease;
}

.dark-theme .settings-title {
  color: #d8d4f2;
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
  transition: color 0.3s ease;
}

.dark-theme .setting-item label {
  color: #e2def8;
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
  transition: all 0.3s ease;
  margin: 0;
  position: relative;
}

.dark-theme .add-game-item {
  background: linear-gradient(180deg, #4a4376 60%, #3a3560 100%);
  border: 2.7px dashed #7f5af0;
  box-shadow: 0 2px 18px rgba(127, 90, 240, 0.25);
}

.add-game-item:hover {
  border-color: #8d32d1;
  box-shadow: 0 7px 32px #b478f66a;
  transform: translateY(-2px) scale(1.04);
}

.dark-theme .add-game-item:hover {
  border-color: #a594f9;
  box-shadow: 0 7px 32px rgba(127, 90, 240, 0.35);
}

.add-icon {
  font-size: 56px;
  color: #a35bfd;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 15px;
  text-shadow: 0 3px 18px #be92e455;
  transition: all 0.3s ease;
}

.dark-theme .add-icon {
  color: #a594f9;
  text-shadow: 0 3px 18px rgba(127, 90, 240, 0.3);
}

.add-label {
  font-size: 20px;
  color: #9e3ce4;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s ease;
}

.dark-theme .add-label {
  color: #e2def8;
}

.games-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.games-list::-webkit-scrollbar-track {
  background: #f0e5ff;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.dark-theme .games-list::-webkit-scrollbar-track {
  background: #2a2839;
}

.games-list::-webkit-scrollbar-thumb {
  background-color: #c4a8f4;
  border-radius: 10px;
  border: 2px solid #f0e5ff;
  transition: all 0.3s ease;
}

.dark-theme .games-list::-webkit-scrollbar-thumb {
  background-color: #6c5ce7;
  border: 2px solid #2a2839;
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

.dark-theme .user-dropdown {
  background: #3a3560;
  border: 1px solid #4a4376;
  box-shadow: 0 4px 18px rgba(90, 79, 207, 0.25);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

#show-menu-btn {
  display: none;    
}

#close-header {
  display: none;
  cursor: pointer;
  margin: 15px;
  color: #a352fa;
}

.dark-theme #close-header {
  color: #a594f9;
}

@media (max-width: 500px) {
  #show-menu-btn {
    display: block;
  }
  #close-header {
    display: inline;
    position: absolute;
    right: 0;
    top: 0;
  }
  .dashboard-header {
    height: 100%;
    max-height: none;
    overflow: auto;
    padding: 34px 0;
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
  
  .dark-theme .dashboard-header {
    background: linear-gradient(120deg, #1e1b2e 0%, #2d2a40 100%);
  }
  
  .header-actions {
    justify-content: center;
  }
}

/* Общие стили для темной темы */
.dark-theme {
  color: #e2def8;
}

.dark-theme .input {
  background-color: #4a4376;
  color: #e2def8;
  border: 1px solid #5a4fcf;
}

.dark-theme .input:focus {
  border-color: #a594f9;
  outline: none;
}

.dark-theme select.input {
  background-color: #4a4376;
  color: #e2def8;
}

.dark-theme option {
  background-color: #3a3560;
  color: #e2def8;
}

.dark-theme .game-card {
  background: linear-gradient(135deg, #4a4376 0%, #3a3560 100%);
  border: 1px solid #5a4fcf;
  box-shadow: 0 4px 20px rgba(90, 79, 207, 0.2);
}

.dark-theme .game-card:hover {
  box-shadow: 0 8px 32px rgba(127, 90, 240, 0.3);
  transform: translateY(-2px);
  border-color: #7f5af0;
}

.dark-theme .game-title {
  color: #e2def8;
}

.dark-theme .game-description {
  color: #c9c1f5;
}

.dark-theme .game-meta {
  color: #a594f9;
}

.dark-theme .game-actions button {
  color: #a594f9;
  background: rgba(127, 90, 240, 0.1);
  border: 1px solid rgba(127, 90, 240, 0.3);
}

.dark-theme .game-actions button:hover {
  background: rgba(127, 90, 240, 0.2);
  color: #d8d4f2;
}

.dark-theme .game-scene-count,
.dark-theme .game-character-count {
  color: #c9c1f5;
}

.dark-theme .game-scene-count svg,
.dark-theme .game-character-count svg {
  stroke: #a594f9;
}
</style>
<template>
  <div id="sidebar">
    <div class="sidebar-user">
      <svg class="user-avatar-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7b3fe4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
      <span class="user-name">{{ this.username }}</span>
    </div>
    <span id="close-sidebar" title="Закрыть меню" @click="close">
      <svg width="28" height="28" fill="none">
        <path d="M7 7l14 14M21 7L7 21" stroke="#7b3fe4" stroke-width="2"/>
      </svg>
    </span>

    <button @click="exit" class="btn">Назад</button>
    <button @click="addScene" class="btn">Создать сцену</button>
    <Scenes
      @addScript="addScript"
      @editScene="editScene"
      @deleteScene="deleteScene"
      @editScript="editScript"
      @deleteScript="deleteScript"
      :scenes="scenes"
    />
  </div>
</template>

<script>
import Scenes from './Scenes.vue';
import { state } from '../store.js';

export default {
  name: 'Sidebar',
  props: ['scenes'],
  components: {
    Scenes,
  },
  computed: {
    state() {
      return state;
    },
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene);
    },
    addScene() {
      this.$emit('addScene', state.selectedGameId);
    },
    editScene(scene) {
      this.$emit('editScene', scene);
    },
    deleteScene(scene) {
      this.$emit('deleteScene', scene);
    },
    exit() {
      this.$router.push('/');
    },
    deleteScript(script, scene) {
      this.$emit('deleteScript', script, scene);
    },
    editScript(script, scene) {
      this.$emit('editScript', script, scene);
    },
    close() {
      this.$emit('close');
    },
  },
  mounted() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.username = user.name + " " + user.surname;
  },
  data() {
    return {
      username: "",
    };
  },
};
</script>

<style scoped>
#sidebar {
  width: 25%;
  min-height: 100vh;
  background-color: #f3e8ff;
  border-right: 1px solid #b392ff;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 20;
  box-shadow: 2px 0 6px rgba(171, 114, 231, 0.05);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.dark-theme #sidebar {
  background-color: #2c2a4a;
  border-right-color: #5b4cb8;
  box-shadow: 2px 0 6px rgba(90, 79, 207, 0.2);
}

#close-sidebar {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 1vw;
  width: fit-content;
  cursor: pointer;
}

#close-sidebar svg {
  stroke: #7b3fe4;
  transition: stroke 0.2s;
}

.dark-theme #close-sidebar svg {
  stroke: #9f8cff;
}

@media (max-width: 750px) {
  #sidebar {
    position: absolute;
    width: 100%;
  }
  #close-sidebar {
    display: inline;
  }
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding-left: 1rem;
}

.user-avatar-icon {
  stroke: #7b3fe4;
  transition: stroke 0.2s;
}

.dark-theme .user-avatar-icon {
  stroke: #9f8cff;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #4a2670;
  letter-spacing: 0.2px;
  transition: color 0.2s;
}

.dark-theme .user-name {
  color: #e8e4ff;
}

.btn {
  background: #f5f3ff;
  border: 1px solid #b392ff;
  color: #4a2670;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  margin-left: 1rem;
}

.dark-theme .btn {
  background: #4a466e;
  border-color: #5b4cb8;
  color: #e8e4ff;
}

.btn:hover {
  background: #e0d7ff;
  border-color: #9f8cff;
}

.dark-theme .btn:hover {
  background: #6f61d0;
  border-color: #8a7cff;
}
</style>
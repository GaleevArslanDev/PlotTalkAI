<template>
  <div id="sidebar">
    <div class="sidebar-user">
  <svg class="user-avatar-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7c37a5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
  <span class="user-name">{{ this.username }}</span>
</div>
  <span id="close-sidebar" title="Закрыть меню" @click="close"><svg width="28" height="28" fill="none"><path d="M7 7l14 14M21 7L7 21" stroke="#a352fa" stroke-width="2"/></svg></span>

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

<style scoped>
#sidebar {
  width: 25%;
  min-height: 100vh;
  background-color: #f3e8ff;
  border-right: 1px solid #d6bcfa;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 20;
  box-shadow: 2px 0 6px rgba(98, 0, 238, 0.05);
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
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 2px 12px #a78ed03c;
  background: linear-gradient(135deg, #c499fe 40%, #beecff 100%);
}
.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #7c37a5;
  letter-spacing: 0.2px;
}
</style>

<script>
import Scenes from './Scenes.vue'
import { state } from '../store.js'
export default {
  name: 'Sidebar',
  props: ['scenes'],
  components: {
    Scenes,
  },
  computed: {
    state() {
      return state
    },
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene)
    },
    addScene() {
      this.$emit('addScene', state.selectedGameId)
    },
    editScene(scene) {
      this.$emit('editScene', scene)
    },
    deleteScene(scene) {
      this.$emit('deleteScene', scene)
    },
    exit() {
      this.$router.push('/')
    },
    deleteScript(script, scene) {
      this.$emit('deleteScript', script, scene)
    },
    editScript(script, scene) {
      this.$emit('editScript', script, scene)
    },
    close() {
      this.$emit('close')
    }
  },
  mounted(){
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.username = user.name + " " + user.surname;
  },
  data(){
    return {
      username: ""
    }
  }
}
</script>
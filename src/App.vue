<script>
import Notifications from '@/components/Notifications.vue';
import { load, state, saveState } from './store';
import CreateCharacterModal from '@/components/CreateCharacterModal.vue';
import CharactersModal from '@/components/CharacterViewModal.vue';
import ModalWindow from './components/ModalWindow.vue';

export default {
  components: { CharactersModal, CreateCharacterModal, Notifications, ModalWindow },
  data() {
    return {
      isLoading: true,
      isCharsModalVisible: false,
      isCharEditModalOpened: false,
      editChar: "",
      selectedGame: null,
    }
  },
  watch: {
    '$route'(to) {
      this.checkAuth(to);
    }
  },
  methods: {
    checkAuth(to) {
      const isAuth = sessionStorage.getItem("user");
      
      if ((to.path === "/login" || to.path === "/register") && isAuth) {
        this.$router.push("/");
      } 
      else if (to.path !== "/login" && to.path !== "/register" && !isAuth) {
        this.$router.push("/login");
      }
    },   
    addChar() {
      this.isCharEditModalOpened = true;
      this.editChar = "";
    },
    editCharF(id) {
      this.isCharEditModalOpened = true;
      this.editChar = id;
    },
    openCharacters(game) {
      this.selectedGame = game
      this.selectedGameCharacters = [...game.characters]
      this.isCharsModalVisible = true
    },
    onSaveCharacters(newChars) {
      this.selectedGame.characters = newChars
      this.isCharsModalVisible = false
      saveState()
    },
    save() {
      let ch = this.$refs.createChar;
      if(this.$refs.createChar.validate()) {
        let res = {
          "id": Date.now().toString(),
          "name": ch.name,
          "profession": ch.job,
          "talk_style": ch.speechStyle,
          "type": ch.type,
          "traits": ch.mood,
          "look": ch.appearance,
          "extra": ch.description
        };
        if(ch.edit){
          this.$refs.charsModal.localChars[this.$refs.charsModal.localChars.findIndex(c => c.id == ch.char.id)] = res;
        }
        else {
          this.$refs.charsModal.localChars.push(res);
        }
        this.isCharEditModalOpened = false;
      }
    },
  },
  async beforeMount() {
    this.checkAuth(this.$route)
    try {
      const val = await load();
      Object.keys(val.data).forEach(key => {
        state[key] = val.data[key];
      });

      if (this.$route.name === 'main') {
        state.selectedGameId = null;
        state.selectedSceneId = null;
        saveState();
      }
      
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
</script>

<template>
  <div id="app">
    <router-view v-if="!isLoading" />
    <Notifications />
    <CharactersModal
      :visible="isCharsModalVisible && !isCharEditModalOpened"
      :characters="selectedGameCharacters"
      @close="isCharsModalVisible = false"
      @save="onSaveCharacters"
      @add="addChar"
      @edit="editCharF"
      ref="charsModal"
    />

    <ModalWindow v-if="isCharEditModalOpened" @closeModal="isCharEditModalOpened = false" :showButtons="true" :header="'Персонаж'" @validate-request="save"><CreateCharacterModal :edit="editChar" :char="selectedGame.characters.find(c => c.id == editChar)" ref="createChar"/></ModalWindow>
    <div v-if="isLoading" class="loading-spinner">
    <svg width="50" height="50" viewBox="0 0 50 50" class="spin">
      <circle cx="25" cy="25" r="20" fill="none" stroke="#7c37a5" stroke-width="4" stroke-dasharray="80 20" />
    </svg>
  </div>
  </div>
</template>

<style>
body {
  overflow: hidden;
  
  background-color: #f3e8ff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #631E9B;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 97.5vh;
  user-select: none;
}
.btn {
    background: linear-gradient(90deg, #c08cff 20%, #cde0ff 100%);
    color: #601f7e;
    border: none;
    border-radius: 7px;
    font-size: 18px;
    padding: 8px 20px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 2px 10px #e5d4ff33;
    transition: background 0.2s, transform 0.1s;
}
.btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
}
.input {
  border-radius: 10px;
  border: black 1px solid;
  height: fit-content;
  width: 100%;
}
.number-input {
  field-sizing: content;
  width: fit-content;
}
.label {
  margin-right: 2%;
}
.flipped-vert {
  -webkit-transform: scale(-1, -1);
  -moz-transform: scale(-1, -1);
  -o-transform: scale(-1, -1);
  transform: scale(-1, -1);
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome, Edge, Opera and Firefox */
}
.error {
  border: #bf0000 1px solid;
}
.error-label {
  color: #bf0000;
  font-size: small;
  flex-basis: 100%;
}
.input {
  background-color: #f7f0ff;
  border-radius: 10px;
  height: fit-content;
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 8px;
  box-sizing: border-box;
  color: #30015f; 
}

.input:focus {
  border: #30015f 1px solid;
}

.icon-with-anim {
  transition: transform 0.1s;
}

.icon-with-anim:hover {
  transform: scale(1.18) rotate(7deg);
}

.loading-spinner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color:#f3e8ff;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dot-animation {
  display: inline-block; /* Чтобы точки были в одной строке */
}

.dot-animation span {
  opacity: 0; /* Начальная прозрачность */
  animation: blink 1s infinite; /* Применяем анимацию */
  animation-delay: 0s; /* Задержка для каждой точки */
}

.dot-animation span:nth-child(2) {
  animation-delay: 0.2s;
}

.dot-animation span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
<script lang="ts">
import Sidebar from './Sidebar.vue'
import MainView from './MainView.vue'
import ModalWindow from './ModalWindow.vue'
import CreateScriptModal from './CreateScriptModal.vue'
import CreateSceneModal from './CreateSceneModal.vue'
import { state, defaultState, saveState } from '@/store.js'
import '@/types.js'
import ScriptItem from '@/components/ScriptItem.vue'
import { watch } from 'vue'
import AnswerLoadingModal from '@/components/AnswerLoadingModal.vue'
import CreateCharacterModal from '@/components/CreateCharacterModal.vue'
import { submitData } from '../../api/api'
import { scene } from '@/types.js'
import notifications from '@/notifications'

export default {
  name: 'EditGamePage',
  computed: {
    stateLoc() {
      return state
    },
  },
  components: {
    AnswerLoadingModal,
    ScriptItem,
    CreateScriptModal,
    CreateSceneModal,
    ModalWindow,
    Sidebar,
    MainView,
    CreateCharacterModal,
  },
  data() {
    return {
      games: [
        { id: '1752067787408', title: 'Game 1', scripts: [], characters: [] },
        { id: 2, title: 'Game 2', scripts: [], characters: [] },
      ],
      createScriptModalOpened: false,
      createSceneModalOpened: false,
      createScriptGameId: null,
      scenes: [],
      game: null,
      answerLoadingModalOpened: false,
      createCharacterModalOpened: false,
      scriptEdit: 'false',
      scriptToEdit: null,
      scriptEditScene: null,
      sceneToEdit: null,
      regenerate: false,
      username: '',
      isSidebar: false,
      darkTheme: false,
      language: 'ru',
    }
  },
  mounted() {
    this.updateScreenWidth()
    this.game = state.games.find((g) => g.id === this.$route.params.id)
    state.selectedGameId = this.$route.params.id
    this.checkGameExists()
    window.addEventListener('resize', this.updateScreenWidth)
    this.darkTheme = localStorage.getItem('darkTheme') === '1'
    document.body.classList.toggle('dark-theme', this.darkTheme)
    this.language = localStorage.getItem('locale') || this.$i18n.locale || 'ru'
    this.$i18n.locale = this.language
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeMount() {
    this.game = state.games.find((g) => g.id === this.$route.params.id)
    if (!this.game) {
      this.$router.push('/')
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenWidth)
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    checkGameExists() {
      if (!this.game) {
        this.$router.push('/')
      }
    },
    createGame(game) {
      state.games.push({
        id: game.id.toString(),
        name: game.title,
        scenes: [],
        characters: [],
      })
      this.games.push(game)
      saveState()
    },
    createScene(scene) {
      state.games[state.games.findIndex((game) => game.id === state.selectedGameId)].scenes.push({
        id: scene.id,
        name: scene.name,
        scripts: scene.scripts,
        characters: scene.characters,
      })
      saveState()
    },
    setCreateScriptModalState(state) {
      this.createScriptModalOpened = state
      if (!state) {
        this.createScriptGameId = null
      }
    },
    setCreateSceneModalState(state) {
      this.createSceneModalOpened = state
    },
    setAnswerLoadingModalState(state) {
      this.answerLoadingModalOpened = state
    },
    setCreateCharacterModalState(state) {
      this.createCharacterModalOpened = state
    },
    addScript(scene) {
      this.setCreateScriptModalState(true)
      this.createScriptGameId = state.selectedGameId
      this.createScriptSceneId = scene.id
      this.scriptEdit = "false"
      this.scriptToEdit = null
      this.scriptEditScene = scene
    },
    addScene() {
      this.sceneToEdit = null
      this.setCreateSceneModalState(true)
    },
    editScene(scene) {
      this.sceneToEdit = { ...scene }
      this.setCreateSceneModalState(true)
    },
    deleteScene(scene) {
      const game = state.games[state.games.findIndex((g) => g.id === state.selectedGameId)]
      game.scenes = game.scenes.filter((s) => s.id !== scene.id)
      saveState()
    },
    deleteScript(script, scene) {
      const game = state.games[state.games.findIndex((g) => g.id === state.selectedGameId)]
      const sc = game.scenes[game.scenes.findIndex((s) => s.id === scene.id)]
      sc.scripts = sc.scripts.filter(s => s.id !== script.id)
      saveState()
    },
    editScript(script, scene) {
      this.setCreateScriptModalState(true)
      this.createScriptGameId = state.selectedGameId
      this.createScriptSceneId = scene.id
      this.scriptEdit = script.id
      this.scriptToEdit = script
      this.scriptEditScene = scene
    },
    saveScript() {
      if (this.$refs.child.validate()) {
        let child = this.$refs.child
        let gameId = this.createScriptGameId
        let sceneId = this.createScriptSceneId
        let game = state.games[state.games.findIndex((game) => game.id === this.createScriptGameId)]
        let scenes = game.scenes
        let scene = scenes[scenes.findIndex((gameId) => gameId.id == this.createScriptSceneId)]
        let dialog = {
          id: this.scriptEdit === "false" ? Date.now().toString() : this.scriptToEdit.id,
          name: child.name,
          answers_from_m: child.answers_from_m,
          answers_to_m: child.answers_to_m,
          answers_from_n: child.answers_from_n,
          answers_to_n: child.answers_to_n,
          main_character: child.main_character,
          to_npc_relations: child.to_npc_relations,
          npc: child.npc,
          to_main_character_relations: child.to_main_character_relations,
          description: child.description,
          itemData: child.itemData,
          infoData: child.infoData,
          additional: child.additional,
          result: !this.regenerate ? {} : scene.scripts.find(s => s.id == this.scriptToEdit.id).result,
        }
        this.setCreateScriptModalState(false)
        if (this.scriptEdit === "false") {
          scene.scripts.push(dialog)
        } else {
          scene.scripts[scene.scripts.findIndex(s => s.id == this.scriptToEdit.id)] = dialog
          saveState()
          if (!this.regenerate) return
        }

        let goals = []
        if (dialog.infoData.gets) {
          goals.push({
            type: this.$t('editGamePage.infoGoal'),
            object: dialog.infoData.name,
            condition: dialog.infoData.condition,
          })
        }
        if (dialog.itemData.gets) {
          goals.push({
            type: this.$t('editGamePage.itemGoal'),
            object: dialog.itemData.name,
            condition: dialog.itemData.condition,
          })
        }

        const dialogData = {
          npc: game.characters.find((c) => c.id == child.npc),
          hero: game.characters.find((c) => c.id == child.main_character),
          world_settings: game.description,
          NPC_to_hero_relation: dialog.to_main_character_relations,
          hero_to_NPC_relation: dialog.to_npc_relations,
          mx_answers_cnt: dialog.answers_to_m,
          mn_answers_cnt: dialog.answers_from_m,
          mx_depth: dialog.answers_to_n,
          mn_depth: dialog.answers_from_m,
          scene: scene.description,
          genre: game.genre,
          epoch: game.techLevel,
          tonality: game.tonality,
          extra: dialog.additional,
          context: dialog.description,
          goals: goals,
          game_id: gameId.toString(),
          scene_id: sceneId.toString(),
          script_id: dialog.id.toString()
        }
        this.$refs.graph.reloadGraph()
        submitData(dialogData, "generate", true)
          .then(
            (response) => {
              if (response.error) {
                throw response.error.data
              }
            },
          )
          .catch((error) => console.error(this.$t('editGamePage.error'), error))
        state.selectedSceneId = this.createScriptSceneId
        state.selectedScriptId = dialog.id
        this.$nextTick(() => {
          if (this.$refs.graph) {
            this.$refs.graph.reloadGraph()
          }
        })
      }
      
      saveState()
      notifications.notify(this.$t('editGamePage.scriptSaved'))
    },
    saveScene() {
      if (this.$refs.sceneChild.validate()) {
        let child = this.$refs.sceneChild
        let game = state.games[state.games.findIndex((game) => game.id === state.selectedGameId)]
        if (this.sceneToEdit) {
          const idx = game.scenes.findIndex((s) => s.id === this.sceneToEdit.id)
          if (idx !== -1) {
            game.scenes[idx] = {
              ...game.scenes[idx],
              name: child.name,
              characters: child.characters,
              description: child.description,
            }
          }
        } else {
          game.scenes.push({
            id: Date.now(),
            name: child.name,
            characters: child.characters,
            description: child.description,
            scripts: [],
          })
        }
        saveState()
        notifications.notify(this.$t('editGamePage.sceneSaved'))
        this.sceneToEdit = null
        this.setCreateSceneModalState(false)
      }
    },
    openCharacters(game) {
      this.$parent.$parent.openCharacters(game)
    },
    updateScreenWidth() {
      this.isSidebar = window.innerWidth > 749.99
    },
    handleStorageChange(event) {
      if (event.key === 'darkTheme') {
        this.darkTheme = event.newValue === '1'
        document.body.classList.toggle('dark-theme', this.darkTheme)
      }
      if (event.key === 'locale') {
        this.language = event.newValue || 'ru'
        this.$i18n.locale = this.language
      }
    },
  },
}
</script>

<template>
  <div class="edit-game-page-container" v-if="game">
    <Sidebar
      v-if="game && isSidebar"
      :scenes="game.scenes"
      @addScene="addScene"
      @addScript="addScript"
      @editScene="editScene"
      @deleteScene="deleteScene"
      @editScript="editScript"
      @deleteScript="deleteScript"
      @close="isSidebar = false"
    />
    <MainView
      v-if="!(stateLoc.selectedSceneId === null || stateLoc.selectedScriptId === null)"
      ref="graph"
      @createScene="addScene"
      @createScript="addScript"
      @openSidebar="isSidebar = true"
    />
    <div v-else class="empty-dialog-placeholder">
      <button class="btn" id="show-sidebar" :title="$t('editGamePage.showSidebar')" @click="isSidebar = true">{{ $t('editGamePage.showSidebar') }}</button>
      <p>{{ $t('editGamePage.dialogPlaceholder') }}</p>
    </div>
    <ModalWindow
      v-if="createScriptModalOpened"
      :regen="scriptEdit !== 'false'"
      :header="$t('editGamePage.dialog')"
      :show-buttons="true"
      @closeModal="setCreateScriptModalState"
      @validate-request="saveScript"
      @regenerate="regenerate = true"
    >
      <CreateScriptModal ref="child" :edit="scriptEdit" :script="scriptToEdit" :scene="scriptEditScene" />
    </ModalWindow>

    <ModalWindow
      v-if="createSceneModalOpened"
      :header="$t('editGamePage.scene')"
      :show-buttons="true"
      @closeModal="setCreateSceneModalState"
      @validate-request="saveScene"
    >
      <CreateSceneModal ref="sceneChild" :sceneData="sceneToEdit" @editCharacters="openCharacters" />
    </ModalWindow>

    <ModalWindow
      v-if="answerLoadingModalOpened"
      :header="$t('editGamePage.loading')"
      @closeModal="setAnswerLoadingModalState"
      :show-buttons="false"
    >
      <AnswerLoadingModal />
    </ModalWindow>
    <ModalWindow
      v-if="createCharacterModalOpened"
      :header="$t('editGamePage.character')"
      @closeModal="setCreateCharacterModalState"
      :show-buttons="true"
    >
      <CreateCharacterModal />
    </ModalWindow>
  </div>
</template>

<style scoped>
.edit-game-page-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 97.5vh;
  background: linear-gradient(180deg, #f8f0ff 0%, #e0d7ff 100%);
  transition: background 0.2s;
}

.dark-theme .edit-game-page-container {
  background: linear-gradient(180deg, #1e1b2e 0%, #2d2a40 100%);
}

.empty-dialog-placeholder {
  margin: 20px 30px;
  font-style: italic;
  font-size: 1.1rem;
  color: #7b3fe4;
  justify-content: center;
  justify-self: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: color 0.2s;
}

.dark-theme .empty-dialog-placeholder {
  color: #e8e4ff;
}

.btn {
  background: linear-gradient(90deg, #b392ff 20%, #d9e4ff 100%);
  color: #4a2670;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(171, 114, 231, 0.3);
  transition: background 0.2s, transform 0.1s;
}

.dark-theme .btn {
  background: linear-gradient(90deg, #5b4cb8 20%, #8a7cff 100%);
  color: #e8e4ff;
  box-shadow: 0 4px 16px rgba(90, 79, 207, 0.4);
}

.btn:hover {
  background: #e0d7ff;
  transform: translateY(-2px);
}

.dark-theme .btn:hover {
  background: #6f61d0;
}

#show-sidebar {
  display: none;
}

@media (max-width: 750px) {
  #show-sidebar {
    display: block;
    width: 100%;
    max-width: 200px;
  }
}
</style>
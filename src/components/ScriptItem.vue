<script>
import { saveState, state } from "@/store";
import { script } from "../types";

export default {
  name: 'ScriptItem',
  data() {
    return {
      isMenuVisible: {},
      menuX: 0,
      menuY: 0,
    };
  },
  computed: {
    menuStyles() {
      return {
        top: `${this.menuY}px`,
        left: `${this.menuX}px`,
      };
    },
  },
  props: {
    script: {
      type: Object,
      required: true
    },
    scene: {
      type: Object,
      required: true
    }
  },
  methods: {
    openScript() {
      state.selectedSceneId = this.scene.id;
      state.selectedScriptId = this.script.id;
      saveState();
    },
    showContextMenu(event, id) {
      this.menuX = Math.min(event.clientX, window.innerWidth - 200);
      this.menuY = event.clientY;
      this.isMenuVisible[id.toString()] = true;
    },
    deleteScript() {
      this.$emit('deleteScript', this.script);
    },
    editScript() {
      this.$emit('editScript', this.script);
    },
  },
  mounted() {
    window.addEventListener('click', (event) => {
      if (!event.target.closest('.custom-context-menu')) {
        for (let key in this.isMenuVisible) {
          this.isMenuVisible[key] = false;
        }
      }
    });
  },
};
</script>

<template>
  <div class="script-item scenes" @click="openScript" @contextmenu.prevent="showContextMenu($event, script.id)">
    <div class="custom-context-menu" v-if="isMenuVisible[script.id.toString()]" :style="menuStyles">
      <button class="scene-btn icon-with-anim" @click.stop="editScript" title="Редактировать">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#7b3fe4" fill="none" stroke-width="1.5">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </button>
      <button class="scene-btn icon-with-anim" @click.stop="deleteScript" title="Удалить">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#7b3fe4" fill="none" stroke-width="1.5">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    </div>
    {{ script.name }}
  </div>
</template>

<style scoped>
.scenes {
  background-color: #f3e8ff;
  transition: background 0.2s;
}

.dark-theme .scenes {
  background-color: #2c2a4a;
}

.script-item {
  cursor: pointer;
  width: 100%;
  background: #f3e8ff;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  color: #4a2670;
}

.dark-theme .script-item {
  background: #2c2a4a; 
  color: #e8e4ff;
}

.script-item:hover {
  background: #e9d5ff;
}

.dark-theme .script-item:hover {
  background: #3c3a5e;
}

.custom-context-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #b392ff;
  box-shadow: 0 4px 12px rgba(171, 114, 231, 0.3);
  padding: 10px;
  z-index: 99;
  max-width: 200px;
  border-radius: 6px;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.dark-theme .custom-context-menu {
  background: #3c3a5e;
  border-color: #5b4cb8;
  box-shadow: 0 4px 12px rgba(90, 79, 207, 0.4);
}

.scene-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin: 4px 0;
  display: block;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.scene-btn svg {
  stroke: #7b3fe4;
  transition: stroke 0.2s;
}

.dark-theme .scene-btn svg {
  stroke: #9f8cff;
}

.scene-btn:hover {
  background: #e0d7ff;
}

.dark-theme .scene-btn:hover {
  background: #6f61d0;
}
</style>
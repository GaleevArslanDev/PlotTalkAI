<template>
      <div class="modal-content">
        <div class="left-column">
          <div class="row">
            <div class="column">
              <h2>Имя</h2>
              <input type="text" v-model="name" required class="input" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
            </div>
            <div class="column">
              <h2>Профессия</h2>
              <input type="text" v-model="job" required class="input" />
        <span class="error-label" v-if="this.errors.job">Это поле обязательно для заполнения</span>
            </div>
          </div>

          <div>
            <h2>Характеристика</h2>
            <textarea v-model="description" required class="input" rows="5"></textarea>
        <span class="error-label" v-if="this.errors.description">Это поле обязательно для заполнения</span>
          </div>
        </div>

        <div class="right-column">
          <div>
            <h2>Характер</h2>
            <input type="text" v-model="mood" required class="input" />
        <span class="error-label" v-if="this.errors.mood">Это поле обязательно для заполнения</span>
          </div>

          <div>
            <h2>Стиль речи</h2>
            <textarea v-model="speechStyle" required class="input" rows="3"></textarea>
        <span class="error-label" v-if="errors.speechStyle">Это поле обязательно для заполнения</span>
          </div>

          <div>
            <h2>Внешний вид</h2>
            <textarea v-model="appearance" required class="input" rows="3"></textarea>
        <span class="error-label" v-if="this.errors.appearance">Это поле обязательно для заполнения</span>
          </div>
          
        </div>
      </div>
</template>

<script>
import { onMounted } from 'vue';
import ModalWindow from './ModalWindow.vue';
import { state } from '@/store';

export default {
  name: "CharacterForm",
  components: { ModalWindow },
  props: ['edit', 'char'],
  data() {
    return {
      name: this.char?.name,
      job: this.char?.profession,
      description: this.char?.extra,
      type: "",
      mood: this.char?.traits,
      speechStyle: this.char?.talk_style,
      appearance: this.char?.look,
      fieldsToValidate: ['name', 'job', 'description', 'mood', 'speechStyle', 'appearance'],
      errors: {}
    };
  },
  methods: {
    handleClose() {
      this.$emit('closeModal', false);
    },
    validate() {
      this.resetErrors()
          const err = [];
        for (const field of this.fieldsToValidate) {
          const value = this[field]

         if (typeof value === 'string') {
            if (!value.trim()) {
              this.errors[field] = true
              err.push(1);
            }
          } else if (
            value === null ||
            value === undefined ||
            value === 0
          ) {
            this.errors[field] = true
            err.push(1);
          }
        return !err.length
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false
      }
    },
  }
};
</script>

<style scoped>
.modal-container {
  max-width: 900px;
  width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-content {
  display: flex;
  gap: 24px;
}

.left-column {
  flex: 2 1 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.right-column {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.row {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

h2 {
  text-align: left;
  font-weight: normal;
  margin-right: 5px;
  margin-top: 0;
}

@media (max-width: 500px){
  .modal-content {
    flex-direction: column;
  }
}

@media (max-width: 370px){
  .row {
    flex-direction: column;
  }
}
</style>
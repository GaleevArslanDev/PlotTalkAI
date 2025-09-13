<script>
export default {
  name: "Checkbox",
  props: ['id', 'label', 'modelValue', 'value'],
  emits: ['update:modelValue', 'onChange'],
  methods: {
    handleChange(e) {
      this.$emit('update:modelValue', e.target.checked);
      this.$emit('onChange', e.target.checked);
    }
  }
}
</script>

<template>
  <div class="checkbox">
    <input
        type="checkbox"
        :id="id"
        :checked="value"
        @change="handleChange"
        class="checkbox-input"
    />
    <label :for="id">
      <span class="checkbox-label">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped>
.checkbox {
  margin-top: 5px;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox-label {
  padding-left: 5px;
  font-size: 16px;
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .checkbox-label {
  color: #e8e4ff;
}

.checkbox-input {
  appearance: none;
  position: relative;
  width: 30px;
  height: 30px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid #b392ff;
  background: #fff1ff;
  transition: border-color 0.5s, background 0.5s;
}

.dark-theme .checkbox-input {
  border-color: #5b4cb8;
  background: #3c3a5e;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
}

.checkbox-input::after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 0px;
  height: 0px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='30' viewBox='0 -960 960 960' width='30' stroke='%237b3fe4' fill='%237b3fe4'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  transition: width 0.5s, height 0.5s;
}

.dark-theme .checkbox-input::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='30' viewBox='0 -960 960 960' width='30' stroke='%239f8cff' fill='%239f8cff'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
}

.checkbox-input:checked::after {
  width: 30px;
  height: 30px;
}

.checkbox-input:disabled {
  background: #e0d7ff;
  border-color: #b392ff;
  opacity: 0.6;
}

.dark-theme .checkbox-input:disabled {
  background: #3c3a5e;
  border-color: #5b4cb8;
  opacity: 0.5;
}

.checkbox-input:disabled::after {
  filter: grayscale(100%);
}
</style>
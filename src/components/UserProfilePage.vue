<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Профиль</h1>
      <form @submit.prevent="save">
        <div class="avatar-group">
          <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>
        <div class="form-group">
          <input v-model="firstName" class="input" placeholder="Имя" />
        </div>
        <div class="form-group">
          <input v-model="lastName" class="input" placeholder="Фамилия" />
        </div>
        <div class="form-group">
          <input v-model="email" class="input" type="email" placeholder="Email" />
        </div>
        <button type="submit" class="btn">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
import { state, updateUser } from '@/store';

export default {
  name: 'UserProfilePage',
  data() {
    return {
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      email: state.user.email,
      avatar: state.user.avatar,
      avatarPreview: state.user.avatar,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        this.avatar = ev.target.result;
        this.avatarPreview = ev.target.result;
      };
      reader.readAsDataURL(file);
    },
    save() {
      updateUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        avatar: this.avatar,
      });
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: #f3f4f6;
  transition: background 0.2s;
}

.dark-theme .auth-page {
  background: #1e1b2e; 
}

.auth-container {
  background: #f8f0ff;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(171, 114, 231, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: #4a2670; 
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.dark-theme .auth-container {
  background: #2c2a4a;
  color: #e8e4ff;
  box-shadow: 0 8px 16px rgba(90, 79, 207, 0.2); 
}

.auth-container h1 {
  color: #4a2670;
  transition: color 0.2s;
}

.dark-theme .auth-container h1 {
  color: #e8e4ff;
}

.avatar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  border: 2px solid #b392ff;
  transition: border-color 0.2s;
}

.dark-theme .avatar {
  border-color: #5b4cb8;
}

.form-group {
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #b392ff;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background: #fff1ff;
  color: #4a2670;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.dark-theme .input {
  border-color: #5b4cb8;
  background: #3c3a5e;
  color: #e8e4ff;
}

.input:focus {
  border-color: #9f8cff;
  box-shadow: 0 0 0 1px #9f8cff;
}

.dark-theme .input:focus {
  border-color: #8a7cff;
  box-shadow: 0 0 0 1px #8a7cff;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background: #7b3fe4;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.dark-theme .btn {
  background: #9f8cff;
}

.btn:hover {
  background: #9f8cff;
}

.dark-theme .btn:hover {
  background: #8a7cff;
}
</style>
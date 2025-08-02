import { reactive, toRaw } from 'vue'
import { putData, fetchData } from '../api/api'

// СТРУКТУРА ДАННЫХ
const defaultState = {
  games: [],
  selectedGameId: null,
  selectedSceneId: null,
  selectedScriptId: null,
  token: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
  },
}

async function load() {
  let res = await fetchData(`users/me/data`, true);
  return res
}

export function resetState() {
  Object.assign(state, defaultState)
}

const state = reactive({...defaultState})

function saveState() {
  putData({'data': toRaw(state)}, `users/me/upd/data`, true)
}

function setToken(token) {
  state.token = token
  saveState()
}

function clearToken() {
  state.token = null
  saveState()
}

function updateUser(data) {
  state.user = { ...state.user, ...data }
  saveState()
}

export { state, defaultState, load, saveState, setToken, clearToken, updateUser }

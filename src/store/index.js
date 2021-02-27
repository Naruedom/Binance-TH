import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import imageUser from '@/assets/images/user.png';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: 'BNB',
    user: {
      photoURL: '',
      displayName: '',
    },
    profile: {
      uid: '',
      name: '',
      image: 'http://via.placeholder.com/100x100/?text=User',
      description: '',
      favorite: [],
    },
    error: null,
    loading: false
  },
  getters: {
    isLogin(state) {
      return state.user && state.user.uid;
    },
    appTitle(state) {
      return state.appName
    },
    getUser(state) {
      return state.user
    },
    getProfile(state) {
      return state.profile
    },
    getProfileImage(state) {
      return state.profile && state.profile.image ? state.profile.image : imageUser;
    },
    getError(state) {
      return state.error
    },
    getLoading(state) {
      return state.loading
    }
  },
  mutations: {
    setProfile(state, payload) {
      state.profile = payload
    },
    updateProfile(state, payload) {
      state.profile = { ...state.profile, ...payload };
    },
    setUser(state, payload) {
      state.user = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setAccountEmpty(state) {
      state.user = { photoURL: '', displayName: '' };
      state.profile = { uid: '', name: '', image: 'http://via.placeholder.com/100x100/?text=User', description: '', favorite: [] };
    },
  },
  actions: {

    userLoginGoogle({ commit, dispatch }) {
      commit('setLoading', true)
      var provider = new firebase.auth.GoogleAuthProvider();
      dispatch('loginSocial', provider)
    },

    loginSocial({ commit }, provider) {

      firebase.auth().signInWithPopup(provider).then(function (data) { })
        .catch(function (error) {
          commit('setError', error.message);
          commit('setLoading', false);
        });

    },

    checkAuth({ commit, dispatch }, payload) {
      firebase.auth().onAuthStateChanged((auth) => {
        commit('setLoading', true);

        if (auth) {

          const userDB = {
            uid: auth.uid,
            name: auth.displayName,
            displayName: auth.displayName,
            image: auth.photoURL,
            description: '',
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            online: new Date().getTime(),

            favorites: [],
            apiKey: '',
            secretKey: '',
          }

          var docRef = firebase.firestore().collection("users").doc(auth.uid);

          docRef.get().then((doc) => {
            if (!doc.exists) {
              firebase.firestore().collection('users').doc(auth.uid).set(userDB);
              commit('setProfile', userDB);
            }
            else {
              commit('setProfile', doc.data());
            }

          });

          commit('setUser', auth);
          console.log('auth yes');
          commit('setLoading', false);

        }
        else {
          console.log('auth no');
          commit('setAccountEmpty');
        }
      })
    },

    /* ใช้ตอนที่ต้องการ update ข้อมูลล่าสุดจาก server */
    updateProfileData({ commit }) {
      console.log('updateProfileData');
      var docRef = firebase.firestore().collection("users").doc(this.getters.getUser.uid);
      docRef.get().then(doc => {
        if (doc.exists)
          commit('setProfile', doc.data());
      }).catch(error => { })
    },

    userLogout({ commit }) {
      firebase.auth().signOut();
      commit('setAccountEmpty');
    },

  }
})

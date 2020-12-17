import firebase from "firebase";

export default {
    state: {

    },
    mutations: {

    },
    actions: {
        async createCategory({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUid')
                const category = await firebase.database().ref(`users/${uid}/categories`).push({title, limit})
                return {title, limit, id: category.key}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    },
    getters: {

    }
}
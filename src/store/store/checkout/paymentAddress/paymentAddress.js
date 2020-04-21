import ZonesGql from './list.graphql'

export const state = () => ({
  zones: {
    content: []
  }
})

export const getters = {
  zones(state) {
    return state.zones
  }
}

export const mutations = {
  setZones(state, payload) {
    state.zones = payload
  }
}

export const actions = {
  async zones({ commit }, zoneData) {
    try {
      const {data} = await this.$vfapollo
      .query({
        query: ZonesGql,
        variables: zoneData
      })
      commit('setZones', data.zonesList)
    } catch (e) {
      console.log(e)
      commit('vuefront/setResponseError', e, {root: true})
    }
  }
}

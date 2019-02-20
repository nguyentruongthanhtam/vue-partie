import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import moment from 'moment'
Vue.use(Vuex)
var m = moment()
export default new Vuex.Store({
  state: {
    // Current time
    currentTime: {
      week: '',
      month: '',
      year: ''
    },
    // User's chosen time
    chosenTime: {
      week: 0,
      month: 0,
      year: 0
    },
    // week number in that year
    weeksInYear: m.weeksInYear(),
    // User profile
    user: {},
    // days in that week
    days: [],
    // Is user logged in flag
    isLogged: false,
    // Is data processing task running then trigger the loading animation
    isLoading: false,
    // Add shift modal is on 
    isAddModalOn: false,
    // Delele shift modal is on
    isDelModalOn: false
  },
  mutations: {
    // Set default value of chosenTime to current time
    SET_CURRENT_WEEK(state) {
      state.currentTime.year = m.year()
      state.currentTime.week = m.week()
      state.currentTime.month = m.format("MMM")
      state.chosenTime = state.currentTime
    },
    // Update the chosenTime to the next week
    GO_TO_NEXT_WEEK(state,currentWeek){
      var t = m.week(currentWeek+1)
      state.chosenTime.year = t.year()
      state.chosenTime.month = t.format("MMM")
      state.chosenTime.week = t.week()
    },
    // Update the chosenTime to the last week
    GO_TO_LAST_WEEK(state,currentWeek) {
      var t = m.week(currentWeek-1)
      state.chosenTime.year = t.year()
      state.chosenTime.month = t.format("MMM")
      state.chosenTime.week = t.week()
    },
    // Update the chosenTime to user's choice
    UPDATE_WEEK(state,payload) {
      var week = m.week(payload)
      if(state.chosenTime!= null){
        state.chosenTime.year = week.year()
        state.chosenTime.month = week.format("MMM")
        state.chosenTime.week = week.week()
      }
    },
    // Toggle Add shift modal
    TOGGLE_ADD_MODAL(state)
    {
      state.isAddModalOn = !state.isAddModalOn
    },
    // Toggle Delete shift modal
    TOGGLE_DEL_MODAL(state) {
      state.isDelModalOn = !state.isDelModalOn
    },
    // Set user detail when logged in 
    SET_USER(state,payload)
    {
      state.user = payload
    },
    // Checking authentication function
    CHECK_USER(state,router)
    {
      // turn of the loading animation when the checking started
      state.isLoading = !state.isLoading
      firebase.auth().onAuthStateChanged((user)=>{
        // If user successfully logged in
        if(user)
        {
          state.user = user
          state.isLogged = true
          router ? router.replace('/home') : ''// go to home page
        }
        // If the checking is finished > turn off loading animation
        if(state.isLoading)
        {
          state.isLoading = !state.isLoading
        }
      })
    },
    // Sign user out from the app
    // return true when logged out
    SIGN_OUT(state)
    {
      firebase.auth().signOut().then(()=>{
        state.isLogged = false
        return true;
      })
    },
    // Set days for each week then feed to table interface
    // Extract from moment library
    // Start from Monday to Sunday
    SET_DAYS(state,week){
      state.days = []
      for (var i = 1; i < 8; i++) {
        state.days.push(m.week(week).weekday(i).date())
      }
    }
    },
  actions: {
    SET_CURRENT_WEEK({commit}){
      commit('SET_CURRENT_WEEK')
    },
    GO_TO_LAST_WEEK({commit},payload){
      commit('GO_TO_LAST_WEEK',payload)
    },
    GO_TO_NEXT_WEEK({ commit },payload) {
      commit('GO_TO_NEXT_WEEK',payload)
    },
    UPDATE_WEEK({commit},payload)
    {
      commit('UPDATE_WEEK',payload)
    },
    ADD_TIMESLOT({ commit }) {
      commit('ADD_TIMESLOT')
    },
    SET_USER({commit})
    {
      commit('SET_USER')
    },
    CHECK_USER({commit},router)
    {
      commit('CHECK_USER',router)
    },
    SIGN_OUT({commit}){
      commit('SIGN_OUT')
    },
    SET_DAYS({commit},payload) {
      commit('SET_DAYS',payload)
    },
    TOGGLE_ADD_MODAL({commit})
    {
      commit('TOGGLE_ADD_MODAL')
    },
    TOGGLE_DEL_MODAL({commit}) 
    {
      commit('TOGGLE_DEL_MODAL')
    }
  },
  // expose all states from store to the app
  getters:{
    GET_CURRENT_TIME(state){
      return state.currentTime
    },
    GET_CHOSEN_TIME(state) {
      return state.chosenTime
    },
    IS_ADD_MODAL_ON(state){
      return state.isAddModalOn
    },
    IS_DEL_MODAL_ON(state) {
      return state.isDelModalOn
    },
    GET_WEEKS_IN_YEAR(state) {
      return state.weeksInYear
    },
    GET_SLOTS(state) {
      return state.timeSlots
    },
    GET_USER(state)
    {
      return state.user
    },
    IS_LOGGED(state)
    {
      return state.isLogged
    },
    IS_VERIFIED(state){
      return state.user.emailVerified
    },
    GET_DAYS(state){
      return state.days
    },
    GET_LOADING_FLAG(state)
    {
      return state.isLoading
    }
  }
})

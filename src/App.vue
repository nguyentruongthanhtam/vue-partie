<template>
  <div id="app">
    <!-- Transition wrapper for navbar -->
    <transition name="fade" mode="out-in">

      <nav class="navbar is-transparent" role="navigation" aria-label="main navigation" v-show="isLogged">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/">
            <span class="title is-4">Partie</span>
          </router-link>
        
        <!-- Burger Menu Button -->
        <div class="navbar-burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <!-- Menu -->
        </div>
        <div class="navbar-menu" id="navMenu">
          <!-- navbar-start, navbar-end... -->
            <div class="navbar-start">       
              <!-- navbar items -->
            </div>
            <!-- Logged in User's menu-->
            <div class="navbar-end" v-show="isLogged">
              <div class="navbar-item">
                <a class="button is-outlined" @click="toggleAddShiftModal" v-show="tab==2">
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                  <span>Add Shift</span>
                </a>    
              </div>
              <div class="navbar-item">
                <a class="button is-danger is-outlined" @click="toggleDelShiftModal" v-show="tab==2">
                  <span class="icon">
                    <i class="fas fa-minus"></i>
                  </span>
                  <span>Delete Shift</span>
                </a>
              </div>
              <div class="navbar-item">
                <router-link class="button is-inverted" to='/about'>About</router-link>
              </div>
            </div>
        </div>
      </nav>
    </transition>
    
    <!-- Main View -->
    <section class="wrapper">
      <!-- Transition wrapper for views -->
      <transition name="fade" mode="out-in">
        <router-view keep-alive/>
      </transition>
    </section>

    <!-- Footer -->
    <footer>
      <div class="tabs is-centered" v-show="isLogged && isVerified">
        <ul>
          <li :class="{'is-active':tab==1}" @click="tab = 1">
            <router-link tag="a" to="/">
              <span class="icon is-small"><i class="fas fa-home"></i></span>
              <span>Home</span>
            </router-link>
          </li>
          <li :class="{'is-active':tab==2}" @click="tab = 2">
            <router-link to="/table" >
              <span class="icon is-small"><i class="fas fa-table"></i></span>
              <span>Table</span>
            </router-link>
          </li>
          <li :class="{'is-active':tab==3}" @click="tab = 3">
            <router-link to="/settings">
              <span class="icon is-small"><i class="fas fa-cog"></i></span>
              <span>Settings</span>
            </router-link>
          </li>
        </ul>
    </div>
    </footer>
  </div>
</template>

<script>
import { mapActions ,mapGetters } from "vuex"
export default {
  name: 'app',
   computed:{
    ...mapGetters({
      // Login flags
      isVerified: 'IS_VERIFIED', // User is verified by email
        isLogged: 'IS_LOGGED', // Useris logged in
  })
  },
  data(){
    return {
      tab: '', // tab number
    }
  },
  methods: {
    ...mapActions({
      toggleAddShiftModal: 'TOGGLE_ADD_MODAL'  ,
      toggleDelShiftModal:  'TOGGLE_DEL_MODAL'
    })
  },
  mounted () {
    this.tab = 1
  }
}
document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});
</script>

<style>
.wrapper{
  flex: 1;
}
#app{
display: flex;
  min-height: 100vh;
  min-width: 100vw;
  flex-direction: column;
}
html,body {
    -webkit-overflow-scrolling : touch !important;
    overflow: auto !important;
    height: 100% !important;
     
}
/* View transition animation */
.fade-enter-active{
  transition: opacity .1s ease-in;
}
.fade-leave-active {
  transition: opacity .1s ease-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

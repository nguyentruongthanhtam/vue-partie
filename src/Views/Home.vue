<template>
  <div class="home section has-text-centered">
    <div v-if="!isVerified && isLogged">
      <h1 class="heading">You have to verify your email before using the app.</h1>
      <div class="field is-grouped is-grouped-right">
        <p class="control buttons">
          <router-link to="/register" class="button is-outlined is-info">Edit Profile</router-link>
          <button class="button is-success" @click="resend()"> 
          Resend verification
        </button>
        <button class="button is-danger" @click="logout()"> 
          Logout
        </button>
        </p>
      </div>
    </div>

    <div v-if="isVerified && isLogged">
      <div class="hero">
        <article class="hero-body">  
          <h1 class="title is-4">{{user.displayName?user.displayName:'Unset Username'}}</h1>
            <div class="field">
              <div class="buttons is-centered">
                <button class="button  is-danger" @click="logout()"> 
                  Logout
                </button>
                <router-link to="/register" class="button is-outlined is-info">Profile</router-link>
              </div>
            </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
import firebase from "firebase";
import { mapActions ,mapGetters } from "vuex"
export default {
  computed:{
    ...mapGetters({
      user: 'GET_USER',
      isLogged: 'IS_LOGGED',
      isVerified: 'IS_VERIFIED'
    })
  },
  data() {
    return {
      email:'',
      pass:'',
    };
  },
  methods:{
    ...mapActions({
      setUser: 'SET_USER',
      checkUser: 'CHECK_USER',
      signOut: 'SIGN_OUT'
    }),
    signIn(email,pass){
      var vm = this
      firebase.auth().signInWithEmailAndPassword(this.email,this.pass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode == 'auth/wrong-password')
        {
          vm.$notify.error("Wrong password")
        }
        else if(errorCode == 'auth/user-not-found')
        {
          vm.$notify.error("User not found")
        }
        else if(errorCode == 'auth/invalid-email')
        {
          vm.$notify.error("User not found")
        }
        else
          vm.$notify.error(errorMessage)
        // ...
      }).then((user)=>{
        if(user)
        {
          vm.$notify.info("You're in!")
          this.$router.replace('/home') // Go to home page when user logged in
        }
      },error=>{
          vm.$notify.error(error)
      });
    },
    logout()
    {
      if(this.signOut(this.$router))
      {
        this.$notify.error("See ya!")
        this.$router.replace('/') // return back to login page
      }
    },
    resend()
    {
      this.user.sendEmailVerification().then(()=>{
          this.$notify.info("The verification email has been sent! Please check your inbox/spam!")     
      },error=>{
          this.$notify.error(error)
      });
    }
  },
  mounted()
  {
    // Check authentication when home page loaded 
    this.checkUser(this.$router)
  },
  
};
</script>
<style scoped>
.home{
  flex: 1;
}
</style>
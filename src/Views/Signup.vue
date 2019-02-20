<template>
  <div class="section">
      
        <h1 class="heading">User Profile</h1>
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="text" placeholder="Name" v-model="username">
                <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
                </span>
            </p>
        </div>
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="text" placeholder="Email" v-model="email">
                <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
                </span>
            </p>
        </div>
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="password" placeholder="password" v-model="password">
                <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
                </span>
                <!-- <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span> -->
            </p>
            
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="password" placeholder="confirm password" v-model="passwordConfirm">
                <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
                </span>
                <!-- <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span> -->
            </p>
        </div>
             <div class="field">
              <p class="control has-text-right">
                <button class="button is-danger" @click="signup" :disabled="passwordsIsEmpty"> 
                  Signup
                </button>
              </p>
            </div>
        <div class="field">
            <p class="control has-text-right">
                <router-link to="/" class="button is-primary">Back</router-link>
            </p>
        </div>
</div>
</template>

<script>
import firebase from "firebase";
import { mapActions ,mapGetters } from "vuex"
export default {
    name:'signup',
    computed:{
       passwordsIsEmpty(){
        if( this.password.length>0 && this.passwordConfirm.length>0)
          return false
        else
          return true
      },
      ...mapGetters({
      user: 'GET_USER',
      isLogged: 'IS_LOGGED'
        }),
    },
    
    data () {
      return {
        username:'',
        email:'',
        password: '',
        passwordConfirm: '',

      }
    },
    methods: {
        ...mapActions({
            signOut: 'SIGN_OUT'
        }),
        
        signup(){
            var vm = this
            if(this.passwordConfirm == this.password){
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
                    // Handle Errors here.
                    var errorMessage = error.message;
                    vm.$notify.danger(error.message)
                }).then((user)=>{
                    user.sendEmailVerification()
                    user.updateProfile({
                        displayName: this.username
                    }).then(()=>{
                        this.signOut()
                        vm.$notify.success("Account is successfully created! You are good to go now.")
                        this.$router.replace('/')
                    })
                });

            }
            else
                vm.$notify.danger('Password not match')
        }
    },
    created(){
        
    }
}
</script>


<template>
    <div class="splash has-text-centered">
        <div class="section login-wrapper">
            <h1 class="title has-text-white">Partie</h1>
            <h4 class="subtitle has-text-white">Part-time shifts manager app</h4>
            <div class=" is-4-desktop is-centered is-vcentered">
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" v-model="email" placeholder="Email">
                    <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                    </span>
                    </p>
                </div>
                
                <div class="field">
                    <p class="control has-icons-left">
                    <input class="input" type="password" v-model="pass" placeholder="Password">
                    <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                    </span>
                    </p>
                </div>
                <div class="field is-grouped-right is-grouped ">
                    <p class="control buttons">
                    <router-link class="button is-outlined is-danger is-success" to="/signup"> 
                        Sign Up
                    </router-link>
                    <button class="button is-success" @click="signIn()"> 
                        Login
                    </button>
                    </p>
                </div>
            </div>
        </div>
        <Loading v-show="isLoading"/>
    </div>
</template>

<script>
import firebase from "firebase";
import { mapActions ,mapGetters } from "vuex"
import Loading from "../components/Loading"
export default {
    computed:{
        ...mapGetters({
        user: 'GET_USER',
        isLogged: 'IS_LOGGED',
        isVerified: 'IS_VERIFIED',
        isLoading: 'GET_LOADING_FLAG'
        })
    },
    components:
    {
        Loading
    },
    data() {
        return {
            email: '',
            pass: '',
        };
    },
    methods:
    {
        // Map actions functions from store
        ...mapActions
        ({
        setUser: 'SET_USER',
        checkUser: 'CHECK_USER',
        signOut: 'SIGN_OUT'
        }),

        // Sign in function for users
        signIn(email,pass){
        var vm = this
        firebase.auth().signInWithEmailAndPassword(this.email,this.pass)
        .catch(function(error) {
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
        }).then((user)=>{
            if(user)
            {
                vm.$notify.info("You're in!")
            }
        },error=>{
            vm.$notify.error(error)
        });
        },
    },
    mounted(){
        this.checkUser(this.$router)
    },   
}
</script>

<style>
.splash
{
    flex: 1;
    min-height: 100vh;
    /* Photo by Badhon Ebrahim on Unsplash */
    background: url('../assets/bg-l.jpg') no-repeat center/cover;
    justify-content: flex-end;
}
@media only screen and (max-width: 420px) {
.splash
{
    /* Photo by Marten Bjork on Unsplash */
    background: url('../assets/bg-s.jpg') no-repeat center/cover !important;   
}
.splash::after
{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;   
    background: linear-gradient(to top,#111, rgba(250,250,250,0));
    z-index: 0;
}
.login-wrapper
{
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 1;
}
}
</style>

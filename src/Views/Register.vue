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
                <input class="input" type="text" placeholder="Name" v-model="email">
                <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
                </span>
            </p>
        </div>
        <div class="field">
              <p class="control has-text-right">
                <button class="button is-info" @click="updateProfile()"> 
                  Update Profile
                </button>
              </p>
            </div>
        <h1 class="heading">Change Password</h1>
         <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" ref="password" type="password" placeholder="current password" v-model="currentPassword">
                <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
                </span>
                <!-- <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span> -->
            </p>
        </div>
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="password" placeholder="new password" v-model="newPassword">
                <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
                </span>
                <!-- <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span> -->
            </p>
            
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="password" placeholder="repeat the new password" v-model="newPasswordConfirm">
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
                <button class="button is-danger" @click="updatePassword(newPassword)" :disabled="passwordsIsEmpty"> 
                  Update Password
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
    name:'register',
    computed:{
       passwordsIsEmpty(){
        if(this.currentPassword.length>0 && this.newPassword.length>0 && this.newPasswordConfirm.length>0)
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
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        email:'',

      }
    },
    methods: {
        ...mapActions({
            signOut: 'SIGN_OUT'
        }),
        updateProfile(){
            this.user.updateProfile({
                displayName: this.username
            }).then(()=>{
                if(this.email!=this.user.email)
                {
                    var credential = firebase.auth.EmailAuthProvider.credential(this.user.email,this.currentPassword)
                    this.user.reauthenticateWithCredential(credential)
                        .then(()=>{
                            this.user.updateEmail(this.email)
                                .then(()=>{
                                this.$notify.success("email update successful!")
                                this.signOut()
                                this.$router.replace('/')
                                })
                                .catch((error)=>{
                                this.$notify.danger(error)
                                })
                        })
                        .catch((error)=>{
                            if(error.code='auth/wrong-password')
                            {
                                this.$notify.danger('Please fill in your current password')
                                this.$refs.password.focus()
                            }
                            else
                            {
                                this.$notify.danger(error.message)

                            }
                        })    
                }
                else
                {
                    this.$notify.success("Profile update successful!")

                }
            }).catch((error)=>{
                this.$notify.danger(error)
            })
        },
        updatePassword(newPassword){
            var vm = this
            if(this.newPasswordConfirm == newPassword){
                var credential = firebase.auth.EmailAuthProvider.credential(this.user.email,this.currentPassword)
                this.user.reauthenticateWithCredential(credential).then(()=>{
                    this.user.updatePassword(newPassword)
                    .then(()=>{
                    this.$notify.success("password update successful!")
                    this.signOut()
                    this.$router.replace('/')
                    })
                    .catch((error)=>{
                    this.$notify.danger(error)

                })
            }).catch((error)=>{
                    this.$notify.danger(error)})
            }
            else
                this.$notify.danger('Password not match')
        }
    },
    created(){
        this.username = this.user.displayName
        this.email = this.user.email
    }
}
</script>


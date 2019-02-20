<template id="settings">
  <section class="section">
    <Loading v-if="isLoading" />
    <!-- When the data loaded -->
    <div v-else>
      <h1 class="title has-text-info">Week {{chosenTime.week}}</h1>
      <h1 class="subtitle">{{chosenTime.month}} / {{chosenTime.year}}</h1>
      <h1 class="heading">Change names and hour-per-shift </h1>
        <div class="field has-addons" v-for="(shift,$index) in shifts" :key="$index">
            <p class="control">
              <!-- Name of the shift > can be change -->
              <input class="input has-text-centered" type="text" placeholder="Shift name" v-model="shift.name">
            </p>
          <div class="control is-expanded ">
            <!-- Amount of hour per fixed-shift -->
            <input class="input has-text-centered" type="number" placeholder="Hour per shift" v-model="shift.slot" :disabled="!shift.fixed">
          </div>
        </div>
        <div class="field">
          <p class="control has-text-right">
            <!-- Save button -->
            <button class="button is-primary is-medium is-inverted" @click="save">
              Save
            </button>
          </p>
        </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters , mapActions } from 'vuex'
  import firebase from 'firebase'
  import Loading from '../components/Loading'
  export default {
    components: {Loading}, 
    computed: {
      ...mapGetters({
        user:       'GET_USER',
        chosenTime: 'GET_CHOSEN_TIME',
      }),
    },
    data(){
      return{
        shifts: [],
        isLoading: false
      }
    },
    methods: {
      ...mapActions({
        set_current_week: 'SET_CURRENT_WEEK'
      }),
      // If new week was selected
      // There is no data entry for that week.
      // A new entry was created in order to allow user to set time slot before going to table component
      createNewSlotEntry()
      {
        var newShifts = [
            {
                name: "Morning",
                fixed: true,
                hours: {},
                slot: 0
            },
            {
                name: "Evening",
                fixed: true,
                hours: {},
                slot: 0
            },
            {
                name: "Extra",
                fixed: false,
                hours: {}
            },
          ]
        this.shifts = newShifts
      },
      // Load time slots from database
      loadSlots(){
        this.isLoading = true
          firebase.database()
          .ref('users/' + this.user.uid + '/shifts/' + this.chosenTime.year + '/' + this.chosenTime.week)
          .once('value').then( snap => 
          {
            this.isLoading = false
            snap.val().data.forEach( shift => 
            {
              this.shifts.push(shift)
            });
          })
          // When slot data is empty > create a default shift array to allow user to change their values
          .catch(error=>{
            this.createNewSlotEntry()
          })
        // }
      },
      // Save time slot in database
      save(){
        this.isLoading = true
        firebase.database()
        .ref('users/' + this.user.uid +'/shifts/'+this.chosenTime.year+'/'+this.chosenTime.week)
        .update({
          data: this.shifts
        }).then(()=>{
            this.$notify.success('Slots have been saved!')
            this.isLoading = false
        });
      },
    },
    mounted(){
      // Set time to current week when app is opened
      if(this.chosenTime.week==0)
      {
          this.set_current_week()  
      }
      // load time slots according to user choices
      this.loadSlots()
    }
  }
</script>

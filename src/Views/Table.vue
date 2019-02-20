<template>
    <div id="table">
        <!-- Week Navigation bar -->
        <nav class="level is-mobile">
            <!--Go to last week button  -->
            <div class="level-item has-text-centered" @click="go_to_last_week(chosenTime.week)">
                <span class="icon is-small"><i class="fas fa-angle-left"></i></span>
            </div>
            <div class="level-item has-text-centered">
                <div class="subtitle" style="padding-right: 5px">{{chosenTime.month}} / {{chosenTime.year}} | Week</div>
                <div>
                    <!-- Select week field  -->
                    <div class="field">
                        <div class="control">
                            <div class="select">
                            <select v-model="chosenTime.week" name="week">
                                <option v-for="w in weeksInYear" :key="w">{{w}}</option>
                            </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>           
             <!--Go to next week button  -->
            <div class="level-item has-text-centered" @click="go_to_next_week(chosenTime.week)">
                <span class="icon is-small"><i class="fas fa-angle-right"></i></span>
            </div>
        </nav>
        <!-- Shift Table component -->
        <shifts :chosenTime="chosenTime" class="shift-table" keep-alive></shifts>
    </div>
</template>

<script>
import { mapActions , mapGetters} from 'vuex'
import shifts from '../components/Shifts.vue'

export default {
    watch: {
        // Change to chosen week
         chosenTime:{
            handler(newValue,oldValue) 
            {
                // Update week in store
                this.update_week(newValue.week)
            },
            deep: true
        },
    },
    computed:{
        // Get states from the store
        ...mapGetters({
            user:        'GET_USER',
            isLogged:    'IS_LOGGED',
            chosenTime:  'GET_CHOSEN_TIME',
            weeksInYear: 'GET_WEEKS_IN_YEAR'
        }),
    },
    components: { shifts },
    methods:{
        // Get actions from the store
       ...mapActions({
            set_current_week: 'SET_CURRENT_WEEK',
            go_to_last_week: 'GO_TO_LAST_WEEK',
            go_to_next_week: 'GO_TO_NEXT_WEEK',
            update_week: 'UPDATE_WEEK',
       }), 
  },
  mounted(){
    // Set default time to current calendar week
    if(this.chosenTime.week==0)
    {
        this.set_current_week()  
    }
  },
  
};
</script>
<style scoped lang="sass">
    #table
        // overflow: auto
    .shift-table
        min-width: 100vw
    .level.is-mobile .level-item
        margin: 0
</style>

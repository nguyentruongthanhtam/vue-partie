<template>
    <div>
        <!-- Loading component when data processing-->
        <Loading v-if="isLoading"/>
        <!-- When data done loading-->
        <div v-else>
            <addShift :class="{'is-active':isOnAddShiftModal}" v-on:close="toggleAddShiftModal"  v-on:add="addNewShift($event)"></addShift>        
            <deleteShift :class="{'is-active':isOnDeleteShiftModal}" v-on:close="toggleDeleteShiftModal" :shifts="shifts"></deleteShift> 
            <table class="table is-fullwidth shift-table">
                <thead>
                    <tr>
                        <!-- Dates Row -->
                        <th class="has-text-centered has-text-weight-light" v-for="date in dates" :key="date">{{date}}</th>
                    </tr>
                    <tr>
                        <!-- Day Row -->
                        <th class="has-text-centered" v-for="day in days" :key='day'>{{day}}</th>
                    </tr>
                </thead>
                <tbody>             
                    <!-- Table of shifts -->
                    <tr v-for=" (shift,$shiftIndex) in shifts" :key="$shiftIndex">
                        <td class="has-text-centered" v-for="(date,$index) in dates" :key="$index" :style="colors[$shiftIndex]">
                            <!-- If the shift is fixed hour -->
                            <input class="checkbox" type="checkbox"
                                    :input-id="'checkbox-' + $index"
                                    :value="date"
                                    v-model="shift.hours"
                                    v-if="shift.fixed">
                            <!-- If the shift is NON-fixed hour -->
                            <input class="input is-small" type="number"
                                :input-id="'textbox-' + $index"
                                v-model="shift.hours[$index]"
                                v-else>           
                        </td>
                    </tr>                                    
                </tbody>
            </table>
            <!-- Hours of every shift section -->
            <div class="columns is-mobile is-multiline">
                    <div class="column has-text-centered" 
                        v-for="(shift,$index) in shifts" 
                        :key="$index" 
                        :style="textColors[$index]">
                        <div v-if="shift.fixed">
                        <p class="is-size-7-mobile is-size-6-desktop">{{shift.name}}</p>
                        <!-- Show time slot if set , show 'not set' when is not set -->
                        <p class="is-size-7-mobile is-size-6-desktop">{{shift.slot ? shift.slot+'h / shift' : 'Not set'}}</p>
                        <p class="heading is-size-5-mobile is-size-4-desktop">{{(shift.slot * shift.hours.length).toFixed(2)}}</p>
                        </div>
                        <div v-else>
                            <p class="is-size-7-mobile is-size-6-desktop">{{shift.name}}</p>
                            <p class="heading is-size-5-mobile is-size-4-desktop">{{ shift.hours | total }}</p>
                        </div>
                    </div>
            </div>

            <div class="level is-mobile">
                <!-- Total hours -->            
                <div class="has-text-centered has-text-weight-semibold level-item">
                    <div>
                        <p class="heading">Total</p>
                        <p class="title">{{totalHour}}</p>
                    </div>
                </div>
                
                <!-- Save button -->
                <div class="level-item has-text-centered">
                    <div class="button is-success is-medium is-outlined" :class="{'is-loading': isLoading}" v-show="!isOnAddShiftModal" @click="save()"> 
                        Save
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase'
import addShift from './AddShift.vue'
import deleteShift from './DeleteShift.vue'
import Loading from './Loading.vue'
import { mapActions , mapGetters} from 'vuex'
    export default {
        props: ['chosenTime'],
        watch:
        {
            // Load data from DB when user chosed week
            chosenTime:{
                handler(newValue,oldValue) 
                {
                    if(newValue.week != 0 && newValue.year!=0)
                    {
                        this.week = newValue.week
                        this.month = newValue.month
                        this.year = newValue.year
                        this.getDaysFromWeek(newValue.week)
                        this.load(newValue.year,newValue.week)
                    }
                },
                deep: true
            },
            // Handle changes when user switch betweeen week
            shifts:{
                handler(newValue,oldValue)
                {
                    var sum=0
                    newValue.forEach((shift)=>{
                        if(shift.fixed)
                       {
                           sum += shift.hours.length * Number(shift.slot)
                       }
                       else
                       {
                           for( var el in shift.hours ) {
                               if( shift.hours.hasOwnProperty( el ) ) {
                                   sum += Number( shift.hours[el] );
                               }
                           }
                       }
                    })
                    this.totalHour = sum.toFixed(2)
                },
                deep: true
            }
        },
        computed:{
           ...mapGetters({
               user:     'GET_USER',
               isLogged: 'IS_LOGGED',
               days:     'GET_DAYS',
               isOnAddShiftModal: 'IS_ADD_MODAL_ON',
               isOnDeleteShiftModal: 'IS_DEL_MODAL_ON'
           }),
        },
        filters:{
            // Calculate total hour
            total: (obj)=>{
                 var sum = 0;
                for( var el in obj ) {
                    if( obj.hasOwnProperty( el ) ) {
                    sum += Number( obj[el] );
                    }
                }
                return sum.toFixed(2);
            }
        },
        name: 'shifts',
        components: {
            addShift,
            deleteShift,
            Loading
        },
        data: function(){
            return{
                dates:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                // Color of shifts row
                colors: [
                    {backgroundColor: 'hsla(171, 100%, 41%, 0.5)'},
                    {backgroundColor: 'hsla(204, 86%, 53%, 0.5)'},
                    {backgroundColor: 'hsla(348, 100%, 61%, 0.5)'},
                    {backgroundColor: 'hsla(50, 100%, 53%, 0.5)'},
                    {backgroundColor: 'hsla(316, 97%, 46%, 0.5)'},
                ],
                // Total hours shift color
                textColors: [
                    {color: 'hsl(171, 100%, 41%)'},
                    {color: 'hsl(204, 86%, 53%)'},
                    {color: 'hsl(348, 100%, 61%)'},
                    {color: 'hsl(50, 100%, 53%)'},
                    {color: 'hsl(316, 97%, 46%)'},
                ],
                // Default value when new week is in view
                shifts:[
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
                ],
                week:0,
                year:0,
                totalHour:0,
                isLoading: true,
            }
        },
        methods: {
            // get data from BD 
            // check the snapshot if 
            // data: =>
            // slots: =>
            ...mapActions({
                checkUser:        'CHECK_USER',
                getDaysFromWeek:  'SET_DAYS',
                toggleAddShiftModal: 'TOGGLE_ADD_MODAL',
                toggleDeleteShiftModal: 'TOGGLE_DEL_MODAL'
            }),
            // Load data from database with the chosen time from user
            load(year,week){
                this.isLoading = true
                this.reset()  
                firebase.database()
                .ref('users/'+ this.user.uid +'/shifts/'+year+'/'+week)
                .once("value").then(snapshot=>{
                    var snap = snapshot.val()
                    if(snap)
                    {
                        if(snap.data)
                        {
                            if(snap.data)
                            {
                                // fix Firebase empty array issue
                                snap.data.forEach(n =>{
                                    if(!n.hours)
                                    {
                                        n.hours=[]
                                    }
                                })
                                this.shifts = snap.data
                                this.isLoading = false
                    }}}
                    else{
                        while(this.shifts.length >3)
                        {
                            this.shifts.pop()
                        }
                        this.reset()          
                    }
                })
            },
            // Reset table when going to new week
            reset(){
                this.shifts.forEach(shift=>{
                    shift.hours = []
                    shift.slot = 0
                })
            },
            // save data to BD 
            async save(){
                if(this.user.uid!= null)
                {
                    this.isLoading = true
                    firebase.database()
                    .ref('users/' + this.user.uid +'/shifts/'+this.chosenTime.year+'/'+this.chosenTime.week)
                    .set({
                        data: this.shifts
                    })
                    .then(()=>{
                        this.$notify.success('Data has been saved!')
                        this.isLoading = false
                    })
                }
            },
            // Add new shift function
            addNewShift(newShift){
                // Limit number of shift to 5 => could be an upgradable function
                if(this.shifts.length<5)
                {
                    this.shifts.push(newShift);
                    this.$notify.success('New Shift Was Added!')
                }
                else
                {
                    this.$notify.error('Too many shifts!')
                }
            },
        },
        mounted()
        {  
            this.load(this.chosenTime.year,this.chosenTime.week)
        },
    }
</script>
<style lang="sass">
.shift-table
    overflow: auto
.save-btn
    position: fixed
    bottom: 70px
    right: 50px
    z-index: 99
.columns
    margin-left: 0
    margin-right: 0
.column 
    padding: 5px
.input[type='number']
    padding-left: 2px


</style>

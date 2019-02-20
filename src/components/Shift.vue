<template>
    
        <tr>
            <td>
                {{shift.name}}
            </td>
            <td class="has-text-centered" v-for="(d,$index) in day" :key="d">
                <input class="checkbox" type="checkbox"
                        :input-id="'checkbox-' + $index"
                        :value="d"
                        v-model="shiftData"
                        v-if="shift.fixed"
                        @change="changeEvent"
                    >
                <input class="input" type="text"
                    :input-id="'textbox-' + $index"
                    v-model="shiftData[$index]"
                    v-else
                >           
            </td>

        </tr>
    
</template>

<script>
    export default {
        computed:{
            shiftIn: function () {
                return this.shift
            }
        },
        name: 'shift',
        props: ['shift','day'],
        data: function(){
            return{
                shiftData : this.shift.hours,
                
                
            }
        },
        methods: {
            changeEvent(event){
                console.log("change event fired " + this.shiftData);
                this.$emit('shiftData',this.shiftData)
            }
        }
    }
</script>
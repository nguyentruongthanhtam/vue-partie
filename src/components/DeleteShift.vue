<template>
  <div class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Delete Shift</p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
      <div class="tags">
        <span class="tag is-warning is-medium" v-for="(shift,$index) in shifts" :key="$index">
          {{shift.name}}
          <button class="delete is-small" @click="deleteShift($index)"></button>
        </span>

      </div>
    </section>
    <footer class="modal-card-foot ">
      <button class="button is-primary" @click="close" >Done</button>
    </footer>
  </div>
</div>
</template>

<script>

export default {
    name:'deleteShift',
    props: ['shifts'],
    data () {
      return {
        
      }
    },
    methods: {
      close(){
          this.$emit('close')
      },
      deleteShift(index){
        if(confirm("All data will be remove along with it. Just make sure that you want to delete this shift?"))
        {
          this.shifts.splice(index,1)
        }
      },
    }
}
</script>


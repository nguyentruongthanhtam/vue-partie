<template>
  <div class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add new shift </p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
        <div class="field">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="text" placeholder="Name" v-model="shiftName">
                <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span>
            </p>
        </div>
        <div class="field">
            <p class="control">
                <label class="checkbox">
                    <input type="checkbox" v-model="fixed">
                    Fixed shift
                </label>
            </p>
        </div>
        <div class="field" v-show="fixed">
            <p class="control has-icons-left has-icons-right">
                <input class="input" type="number" placeholder="Hour per shift" v-model="slot">
                <span class="icon is-small is-left">
                <i class="fas fa-hourglass-start"></i>
                </span>
                <span class="icon is-small is-right" :class="{'is-success': !isEmpty}">
                <i class="fas fa-check"></i>
                </span>
            </p>
        </div>
    </section>
    <footer class="modal-card-foot ">
      <button class="button" @click="close">Cancel</button>
      <button class="button is-success is-pulled-right" @click="AddShift" :disabled="isEmpty">Add</button>
    </footer>
  </div>
</div>
</template>

<script>

export default {
    name:'addShift',
    computed:{
      isEmpty(){
        if(this.shiftName.length>=3)
          return false
        else
          return true
      }
    
    },
    data () {
      return {
        shiftName: '',
        fixed: true,
        slot:0,
    
      }
    },
    methods: {
    close(){
        
        this.shiftName =''
        this.fixed = true
        this.slot=0
        this.$emit('close')
    },
    AddShift(){
      if(this.fixed)
      {
        this.$emit('add',{name: this.shiftName,fixed: this.fixed, hours:[], slot: this.slot})
      }
      else
      {
        this.$emit('add',{name: this.shiftName,fixed: this.fixed, hours:[]})
      }
        this.slot = ""
        this.shiftName = ""
        this.fixed = true
        this.close()
        
    }
  }
}
</script>


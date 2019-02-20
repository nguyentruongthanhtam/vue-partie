<template>
    <div class="wrapper">
      <div class="loadingGif">
        <div class="c c1"></div>
        <div class="c c2"></div>
        <div class="c c3"></div>
      </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
// Credit Tam Nguyen 
.wrapper
  width: 100vw
  height: 100px
  vertical-align: middle
  &::before
    content: ''
    background-color: rgba(0,0,0,.6)
    width: 100vw
    height: 100vh
    position: absolute
    top: 0
    left: 0   
    z-index: 4
.loadingGif
  margin: 0 auto
  width: 150px
  height: 70px
  > div
    margin-left: 5px
    margin-right: 5px
    position: relative
  .c
    display: inline-block
    width: 30px
    height: 30px
    border-radius: 30px
    background-color: red
  .c1
    animation: loading 1s linear infinite
  .c2
    animation: loading 1s linear 0.5s infinite
  .c3
    animation: loading 1s linear 0.75s infinite

@keyframes loading
  0%
    top: -30px
    opacity: 0
  50%
    top: 0px
    transform: scale(1.1)
    opacity: 1
  100%
    top: 30px
    opacity: 0
</style>

<template>
    <div class="flip_card flex-grow-1 w-100 flex-shrink-0 mx-1" @click="isTurnedAround = !isTurnedAround">
        <div class="flip_card_inner shadow-sm" :style="{transform:isTurnedAround?'rotateY(180deg)':'rotateY(0deg)'}">
            <div class="card_front bg-white rounded d-flex flex-column justify-content-center align-items-center">
                <h2 class="text-success" style="font-size:36px;">{{vocabulary.name}}</h2>
            </div> 
            <div class="card_back bg-dark text-white rounded d-flex flex-column justify-content-center align-items-center">
                <h2>{{vocabulary.translate}}</h2>
            </div>
        </div>        
    </div>
</template>

<script>
export default {
    name:'VocabularyCard',
    data(){
        return {
            isTurnedAround:false
        }
    },
    mounted(){

    },
    props:{
        vocabulary:{
            type:Object,
            required:true
        }
    }
}
</script>

<style scoped lang="scss">
.flip_card{  
  background-color: transparent;
  perspective: 2000px;
}
.flip_card_inner{
  position: absolute;
  width: 100%;
  height:100%;
  left:0;
  top:0;
  transform-style: preserve-3d;
  transition:transform .3s ease-in-out;

//   &:hover{
//     transform: rotateY(180deg);
//   }
}
.card_front, .card_back{
  width:100%;
  height:100%;
  position: absolute;
  left:0;
  right:0;
  // backface-visibility: hidden;
}

.card_back{
  backface-visibility: hidden;
  transform: rotateY(180deg);
}
</style>
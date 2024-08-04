<template>
    <div class="flip_card flex-grow-1 w-100 flex-shrink-0 mx-1" ref="flipCard" @mousedown="startDrag($event)" @touchstart="startDrag($event)">
        <div class="flip_card_inner shadow-sm" :style="{transform:isTurnedAround?'rotateY(180deg)':'rotateY(0deg)'}" @click="flipCard()">
            <div class="card_front bg-white rounded d-flex flex-column justify-content-center align-items-center">
                <h2 class="text-success" style="font-size:36px;">{{vocabulary.name}}</h2>
            </div> 
            <div class="card_back bg-dark text-white rounded d-flex flex-column justify-content-center align-items-center">
                <h2>{{vocabulary.translate}}</h2>
            </div>
        </div> 
        <div class="position-absolute w-100 bottom-0 p-3" style="transform:translateY(100%);" ref="additionalContent" v-if="vocabulary.canDeleted">
            <div>
                <button class="btn btn-outline-danger w-100" @click.prevent="openDeleteModal()">刪除</button>
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
    },
    methods:{
        flipCard() {
            console.log("flipCard");
            if (!this.isDragging) {
                this.isTurnedAround = !this.isTurnedAround;
            }
        },
        startDrag(event){
            const el = event.currentTarget;
            const originX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;  
            const originY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;  
            var initX = originX;
            var initY = originY;
            

            const sliding = (event)=>{
                this.isDragging = true;
                var moveToX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
                var moveToY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
                initX = moveToX
                initY = moveToY
                //do something during dragging
                if(initY - originY < -120){
                    this.showAdditionalContent();
                }
                else if(initY - originY > 120){
                    this.hideAdditionalContent();
                }
            }

            const handleEndDragging = (event)=>{
                if(event.type === 'touchend'){
                    el.removeEventListener('touchmove',sliding)
                    document.removeEventListener('touchend', handleEndDragging)
                }
                else{
                    el.removeEventListener('mousemove',sliding)
                    document.removeEventListener('mouseup', handleEndDragging)
                }
                //do something after dragging   
                console.log(initX,originX); 
                if(Math.abs(initY - originY)>120){
                    setTimeout(()=>{
                        this.isDragging = false;
                    },0)
                }                    
                else{
                    this.isDragging = false;
                }
            }

            if(event.type === 'touchstart'){
                el.addEventListener('touchmove', sliding)
                document.addEventListener('touchend', handleEndDragging)
            }
            else{
                el.addEventListener('mousemove', sliding)
                document.addEventListener('mouseup', handleEndDragging)
            }  
        },
        showAdditionalContent(){
            if(!this.vocabulary.canDeleted){ return }

            var additionalContent = this.$refs.additionalContent;
            var flipCard = this.$refs.flipCard;
            flipCard.style.top = `-${additionalContent.clientHeight}px`;
        },
        hideAdditionalContent(){
            var flipCard = this.$refs.flipCard;
            flipCard.style.top = `0px`;
        },
        openDeleteModal(){
            this.$emit('openDeleteModal',this.vocabulary);
        }
    }
}
</script>

<style scoped lang="scss">
.flip_card{  
  background-color: transparent;
  perspective: 2000px;
  position: relative;
  transition: top .3s ease-in-out;
  top:0;
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
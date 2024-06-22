<template>
  <div class="flex-grow-1 d-flex flex-column container py-3" style="max-width:500px;">
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div>
        <span class="text-muted fz14">單字主題:</span>
        <h1 class="mb-0">{{cardGroup.name}}</h1>
      </div>
      <button class="btn btn-sm btn-primary" @click="openAddModal()"><i class="fa-solid fa-plus me-1"></i>新增單字卡</button>
    </div>
    <div class="slide_container overflow-hidden d-flex flex-grow-1 w-100 position-relative" ref="slideContainer">
      <vocabulary-card v-for="voc in vocabularies" :key="voc.id" :vocabulary="voc" ref="slidePage"></vocabulary-card>
    </div>
    <div class="p-2 d-flex justify-content-center">
      <button class="btn btn-light mx-1" @click="previousVoc()"><i class="fa-solid fa-angle-left"></i></button>
      <button class="btn btn-light mx-1" @click="nextVoc()"><i class="fa-solid fa-angle-right"></i></button>
    </div>

    <add-vocabulary-modal :groupId="groupId" ref="addVocabularyModal"></add-vocabulary-modal>
  </div>
</template>

<script>
import VocabularyCard from '@/components/VocabularyCard.vue'
import AddVocabularyModal from '@/components/AddVocabularyModal.vue'
//import { Modal } from 'bootstrap'
// import {db} from '@/store/db'
// import { collection, getDocs, } from "firebase/firestore";

export default {
  name:'CardGroup',
  components:{
    VocabularyCard,
    AddVocabularyModal
  },
  data(){
    return {
      selectedVoc:'',
      allowSlide:true,
      isInitialized: false
    }
  },
  computed:{
    cardGroup(){
      return this.$store.state.cardGroups.find(cardGroup =>cardGroup.groupId === this.$route.params.groupId);
    },
    vocabularies(){
      return this.$store.state.vocabularies.filter(voc => voc.groupId == this.groupId);
    }
  },
  watch: {
    vocabularies(value,oldValue){
      if(value.length>0 && !this.isInitialized){
        this.jumpToVoc(value[0].id);
        this.isInitialized = true;
      }
      else if(value.length>oldValue.length){
        let oldVocIds = oldValue.map(voc=> voc.id);
        const newVoc = value.find(voc => !oldVocIds.includes(voc.id));
        this.jumpToVoc(newVoc.id);
      }
    }
  },
  props:{
    groupId:{},
  },
  methods:{
    nextVoc(){
      if(!this.allowSlide){
        return;
      }
      let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
      let nextIndex = currentIndex + 1;
      if(this.vocabularies[nextIndex]){
        this.jumpToVoc(this.vocabularies[nextIndex].id);
      }
      else{
        //最後一個slide到第一個
        nextIndex = 0;
        let slideContainer = this.$refs.slideContainer;
        let firstSlidePage = this.$refs.slidePage[0].$el;
        let clone = firstSlidePage.cloneNode(true);
        slideContainer.append(clone);
        let endDistance = clone.offsetLeft;
        
        this.moveSlidePosition(endDistance,()=>{
          slideContainer.scrollLeft = 0;
          clone.remove();    
          this.allowSlide = true;      
        })
      }
      this.selectedVoc = this.vocabularies[nextIndex];
    },
    previousVoc(){
      if(!this.allowSlide){
        return;
      }
      
      let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
      let previousIndex = currentIndex - 1;
      if(this.vocabularies[previousIndex]){
        this.jumpToVoc(this.vocabularies[previousIndex].id);
      }
      else{
        //第一個slide到最後一個
        previousIndex = this.vocabularies.length-1;
        let slideContainer = this.$refs.slideContainer;
        let firstSlidePage = this.$refs.slidePage[0].$el;
        let lastSlidePage = this.$refs.slidePage[previousIndex].$el;
        let clone = lastSlidePage.cloneNode(true);
        slideContainer.prepend(clone);
        slideContainer.scrollLeft = firstSlidePage.offsetLeft;

        let endDistance = clone.offsetLeft;        
        this.moveSlidePosition(endDistance,()=>{
          clone.remove();
          slideContainer.scrollLeft = lastSlidePage.offsetLeft;   
          this.allowSlide = true;       
        })
      }
      this.selectedVoc = this.vocabularies[previousIndex];
    },
    jumpToVoc(vocId){
      let targetIndex = this.vocabularies.findIndex(voc => voc.id === vocId);
      this.$nextTick(()=>{
        this.allowSlide = false;
        let slidePage = this.$refs.slidePage[targetIndex].$el;
        let endDistance = slidePage.offsetLeft; //備註: 要取得想要的offsetLeft值時，其父元素必須為可定位元素(ex:position:relative)
        this.moveSlidePosition(endDistance,()=>{
          this.allowSlide = true;
        })
      })
      
      let targetVocabulary = this.vocabularies.find(voc=> voc.id === vocId);
      this.selectedVoc = targetVocabulary;

    },
    moveSlidePosition(endDistance,callback){
      let slideContainer = this.$refs.slideContainer;
      let startDistance = slideContainer.scrollLeft;

      let timeStart = null;
      function step(timeStamp){
        if(timeStart === null){
          timeStart = timeStamp
        }
        const duration = 300;
        let progress =  Math.min((timeStamp - timeStart)/duration,1);
        slideContainer.scrollLeft = Math.floor((endDistance - startDistance)*progress + startDistance);

        if(progress<1){
          window.requestAnimationFrame(step);
        }
        else{
          console.log('end')
          if(typeof callback === 'function'){
            callback();
          }
        }
      }
      window.requestAnimationFrame(step);
    },
    openAddModal(){      
      this.$refs.addVocabularyModal.showModal();
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

  &:hover{
    transform: rotateY(180deg);
  }
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

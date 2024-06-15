<template>
  <div class="flex-grow-1 d-flex flex-column container py-3" style="max-width:500px;">
    <div class="d-flex justify-content-between align-items-end">
      <!-- <h1>單字主題: {{cardGroup.name}}</h1> -->
      <button class="btn btn-sm btn-primary" @click="openAddModal()">+</button>
    </div>
    <div class="slide_container overflow-hidden d-flex flex-grow-1 w-100 position-relative" ref="slideContainer">
      <vocabulary-card v-for="voc in vocabularies" :key="voc.id" :vocabulary="voc" ref="slidePage"></vocabulary-card>
    </div>
    <div class="p-2 d-flex justify-content-center">
      <button class="btn btn-light mx-1" @click="previousVoc()">左</button>
      <button class="btn btn-light mx-1" @click="nextVoc()">右</button>
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

      //addVocabularyModal:null
    }
  },
  mounted(){
    //檢查localStorage中是否有上一個單字停留的紀錄，有的話跳至該單字
    // const keyName = this.cardGroup.groupId;
    // let selectedCardString = window.localStorage.getItem('selectedCard');
    // console.log(selectedCardString)
    // let selectedCard = JSON.parse(selectedCardString) || '';
    // let lastVocabularyId = selectedCard[keyName];
    // if(selectedCard && lastVocabularyId){
    //   this.selectedVoc = this.vocabularies.find(voc => voc.id === lastVocabularyId);
      
    //   let slideContainer = this.$refs.slideContainer;
    //   let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
    //   let slidePage = this.$refs.slidePage[currentIndex].$el; 
    //   let endDistance = slidePage.offsetLeft;
    //   slideContainer.scrollLeft = endDistance;
      
    // }
    // else{
    //   this.selectedVoc = this.vocabularies[0];
    // }
    
    
    //將addVocabularyModal儲存在變數中
    //this.addVocabularyModal = new Modal(this.$refs.addVocabularyModal.$el);
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
    // selectedVoc(value){
    //   //操作localStorage時，其值須為字串，因此要儲存object的值時要先用JSON.Stringify字串化
    //   const keyName = this.$route.params.groupId;
    //   let selectedCardString = window.localStorage.getItem('selectedCard');
    //   let selectedCard = JSON.parse(selectedCardString) || {};

    //   selectedCard[keyName] = value.id;
    //   window.localStorage.setItem('selectedCard',JSON.stringify(selectedCard));
    // }
  },
  props:{
    groupId:{},
  },
  methods:{
    nextVoc(){
      if(!this.allowSlide){
        return;
      }
      this.allowSlide = false;

      let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
      let nextIndex = currentIndex + 1;
      if(this.vocabularies[nextIndex]){
        let slidePage = this.$refs.slidePage[nextIndex].$el; 
        let endDistance = slidePage.offsetLeft; //備註: 要取得想要的offsetLeft值時，其父元素必須為可定位元素(ex:position:relative)
        this.moveSlidePosition(endDistance,()=>{
          this.allowSlide = true;
        })
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
      this.allowSlide = false;
      
      let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
      let previousIndex = currentIndex - 1;
      if(this.vocabularies[previousIndex]){
        let slidePage = this.$refs.slidePage[previousIndex].$el; 
        let endDistance = slidePage.offsetLeft;
        this.moveSlidePosition(endDistance,()=>{
          this.allowSlide = true;
        })
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
    },    
    initFirstShowedVoc(){
      const keyName = this.$route.params.groupId;
      let selectedCardString = window.localStorage.getItem('selectedCard');
      let selectedCard = JSON.parse(selectedCardString) || '';
      let lastVocabularyId = selectedCard[keyName];

      if(selectedCard && lastVocabularyId){
        let selectedVoc = this.vocabularies.find(voc => voc.id === lastVocabularyId);
        if(selectedVoc){
          this.selectedVoc = selectedVoc;
          let slideContainer = this.$refs.slideContainer;
          let currentIndex = this.vocabularies.findIndex(voc => voc.id === this.selectedVoc.id);
          let slidePage = this.$refs.slidePage[currentIndex].$el; 
          let endDistance = slidePage.offsetLeft;
          slideContainer.scrollLeft = endDistance;
        }
        else{
          this.selectedVoc = this.vocabularies[0];
        }        
      }
      else{
        this.selectedVoc = this.vocabularies[0];
      }
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

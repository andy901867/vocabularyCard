<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">     -->
    <div class="container py-4">
      <div class="row g-3">
        <div class="col-md-4" v-for="cardGroup in cardGroups" :key="cardGroup.groupId">
          <div class="card">
            <a href="#" v-on:click.prevent="goToCardGroupPage(cardGroup)" class="text-decoration-none text-dark">
              <div class="card-body shadow-sm">
                <h3 class="card-title mb-0"><i class="fa-solid fa-address-book me-2"></i>{{cardGroup.name}}</h3>
              </div>
            </a>          
          </div>
        </div>
      </div>
      <!-- <div>
        <a href='#' v-on:click.prevent="testPassByFunction()">測試function mode 跨頁傳資料</a>
      </div> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// const animalVoc = [
//   {name:'dog',translate:'狗',id:'jij'},
//   {name:'cat',translate:'貓',id:'jijd'},
//   {name:'sheep',translate:'綿羊',id:'jidjd'},
//   {name:'elephant',translate:'象',id:'jifjd'},
// ]
// const fruitVoc = [
//   {name:'apple',translate:'蘋果',id:'jdij'},
//   {name:'mango',translate:'芒果',id:'jifjd'},
// ]

export default {
  name: 'HomeView',
  data (){
    return {
      // cardGroups:[
      //   {name:'動物',groupId:'xxxx',vocabularies:animalVoc},
      //   {name:'水果',groupId:'yyyy',vocabularies:fruitVoc}
      // ]
    }
  },
  computed:{
    cardGroups(){
      return this.$store.state.cardGroups;
    }
  },
  methods:{
    goToCardGroupPage (cardGroup){
      this.$router.push({
        name:'cardGroup',
        params:{
          groupId:cardGroup.groupId,
        }
      })
    }
  }
}
</script>

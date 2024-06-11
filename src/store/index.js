import Vue from 'vue'
import Vuex from 'vuex'

//firestore

// import {db} from './db'
// import { collection, getDocs, } from "firebase/firestore";

// getDocs(collection(db,"vocabularyGroup",'QitPty92hFs9AZbGueoV',"vocabularies")).then(que =>{
//     console.log(que)
//     que.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//       })
// })

//firestore

Vue.use(Vuex);

// const animalVoc = [
//     {name:'dog',translate:'狗',id:'jij'},
//     {name:'cat',translate:'貓',id:'jijd'},
//     {name:'sheep',translate:'綿羊',id:'jidjd'},
//     {name:'elephant',translate:'象',id:'jifjd'},
// ]
// const fruitVoc = [
//     {name:'apple',translate:'蘋果',id:'jdij'},
//     {name:'mango',translate:'芒果',id:'jifjd'},
// ]

const store = new Vuex.Store({
    state:{
        cardGroups:[
            // {name:'動物',groupId:'xxxx',vocabularies:animalVoc},
            // {name:'水果',groupId:'yyyy',vocabularies:fruitVoc}
        ],
        vocabularies: []
    },
    //actions負責非同步操作
    actions:{
        async fetchCardGroups(context){
            try{
                let cardGroups = []
                await fetch("/json/cardGroup.json")
                    .then(response => response.json())
                    .then(data => {
                        cardGroups = data.data;
                    })
                
                context.commit('setCardGroups',cardGroups);
            }
            catch(error){
                console.log(error)
            }
        },
        fetchVocaularies(context, groupId){
            return fetch("/json/vocabularies.json")
            .then(response => response.json())
            .then(data => {
                const vocData = data[groupId];
                if(vocData){
                    vocData.forEach(voc=>{
                        voc.groupId = groupId;
                    })
                    context.commit('setVocabularies', vocData);
                    return vocData;
                }
            })
        },
        addVocabulary(context,payload){
            context.commit('addVocabulary',payload);
        }
    },
    //mutations負責更新狀態(state)
    mutations:{
        setCardGroups(state,cardGroups){
            state.cardGroups = cardGroups
        },
        setVocabularies(state,vocData){
            state.vocabularies = state.vocabularies.concat(vocData);
        },
        addVocabulary(state,payload){
            console.log(state)
            console.log(payload)
            let targetGroup = state.cardGroups.find(cardGroup => cardGroup.groupId === payload.groupId);
            targetGroup.vocabularies.push(payload.vocabulary);
        }
    }
});

export default store;


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

const store = new Vuex.Store({
    state:{
        cardGroups:[],
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
        initFetchVocaularies(context){
            //預設單字資料
            const promise1 = fetch("/json/vocabularies.json")
            .then(response => response.json())
            .then(data => {
                //整理JSON檔案的預設單字資料
                let allVocabularies = [];
                for(let prop in data){
                    let groupId = prop;
                    let vocabularies = data[groupId]
                    vocabularies.forEach(voc=>{
                        voc.groupId = groupId;
                        voc.canDeleted = false;
                    })
                    allVocabularies = allVocabularies.concat(vocabularies);
                }
                return allVocabularies;                                
            })

            //localStorage當中的單字資料
            const promise2 = context.dispatch("getLocalStorageVocabularies").then(userVocabularies=>{
                return userVocabularies;
            })

            Promise.all([promise1, promise2]).then((data)=>{
                const allVocabularies = data[0].concat(data[1]);
                context.commit('setVocabularies', allVocabularies);
            })
        },
        getLocalStorageVocabularies(){
            const userVocabulariesString = localStorage.getItem("user_vocabularies");
            let userVocabularies = [];
            if(userVocabulariesString){
                userVocabularies = JSON.parse(userVocabulariesString);
            }
            return userVocabularies;
        },
        addVocabulary(context,newVoc){
            context.commit('setAddVocabulary',newVoc);
            //同步加到localStorage
            context.dispatch("getLocalStorageVocabularies").then(userVocabularies=>{
                userVocabularies.push(newVoc);
                localStorage.setItem("user_vocabularies",JSON.stringify(userVocabularies));
            });
        },
        deleteVocabulary(context,vocId){
            const vocabularies = context.state.vocabularies;
            const deletedIndex = vocabularies.findIndex(voc=>voc.id!==vocId);
            vocabularies.splice(deletedIndex,1);
            //同步刪除localStorage
            context.dispatch("getLocalStorageVocabularies").then(userVocabularies=>{
                const newUserVocabularies = userVocabularies.filter(voc=>voc.id!==vocId);
                localStorage.setItem("user_vocabularies",JSON.stringify(newUserVocabularies));
            })
        }
    },
    //mutations負責更新狀態(state)
    mutations:{
        setCardGroups(state,cardGroups){
            state.cardGroups = cardGroups
        },
        setVocabularies(state,vocabularies){
            state.vocabularies = vocabularies;
        },
        setAddVocabulary(state,newVoc){
            state.vocabularies.push(newVoc);
        }
    }
});

export default store;


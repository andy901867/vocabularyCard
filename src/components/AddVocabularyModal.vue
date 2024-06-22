<template>
<div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">新增單字卡</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="text-muted">英文單字</label>
                    <input type="text" class="form-control" v-model.trim="vocName">
                    <span class="text-danger" style="font-size:13px;" :class="{invisible: !isShowVocNameAlert}">尚未填寫</span>
                </div>
                <div class="mb-3">
                    <label class="text-muted">中文翻譯</label>
                    <input type="text" class="form-control" v-model.trim="translate">
                    <span class="text-danger" style="font-size:13px;" :class="{invisible: !isShowTranslateAlert}">尚未填寫</span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="handleAddVocabularyBtn()">新增單字</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { Modal } from 'bootstrap'
import { utils } from '@/utilities/utils.js'
const { GenerateRandomId } = utils;
export default {
    name:'AddVocabularyModal',
    data(){
        return{
            bootstrapModal: null,
            vocName:"",
            translate: "",
            isShowVocNameAlert: false,
            isShowTranslateAlert : false
        }
    },
    props:{
        groupId:{}
    },
    mounted(){
        this.bootstrapModal = new Modal(this.$el);
    },
    methods:{
        showModal(){
            this.bootstrapModal.show();
        },
        hideModal(){
            this.bootstrapModal.hide();
        },
        handleAddVocabularyBtn(){
            let isPassValidation = this.validation();
            if(!isPassValidation){
                return
            }

            this.addVocabulary();
            this.vocName = "";
            this.translate = "";
            this.hideModal();
        },
        addVocabulary(){            
            var newVoc = {
                name:this.vocName,
                translate:this.translate,
                id: GenerateRandomId(6),
                groupId:this.groupId,
                canDeleted: true
            }
            this.$store.dispatch('addVocabulary',newVoc)
        },
        validation(){
            if(this.vocName === "" || this.translate === ""){
                if(this.vocName === ""){
                    this.isShowVocNameAlert = true;
                }
                else{
                    this.isShowVocNameAlert = false;
                }
                
                if(this.translate === ""){
                    this.isShowTranslateAlert = true;
                }
                else{
                    this.isShowTranslateAlert = false;
                }
                return false;
            }
            else{
                return true;
            }
        }
    }
}
</script>

<style>

</style>
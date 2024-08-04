<template>
<div class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">刪除</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <span>確定要刪除</span>
                <span class="text-danger">{{ vocabulary.name }}</span>
                <span>-</span>
                <span class="text-danger">{{ vocabulary.translate }}</span>?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="handleDeleteVocabularyBtn()">確定刪除</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
    name:'DeleteVocabularyModal',
    data(){
        return{
            bootstrapModal: null,
            vocabulary:{}
        }
    },
    props:{
        groupId:{}
    },
    mounted(){
        this.bootstrapModal = new Modal(this.$el);
    },
    methods:{
        showModal(vocabulary){
            this.vocabulary = vocabulary;
            this.bootstrapModal.show();
        },
        hideModal(){
            this.bootstrapModal.hide();
        },
        handleDeleteVocabularyBtn(){
            this.$store.dispatch('deleteVocabulary',this.vocabulary.id);
            this.hideModal();
        } 
    }
}
</script>

<style>

</style>
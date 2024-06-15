export const utils = {
    GenerateRandomId(length=Number){
        let Id = "";
        let chractorString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let chractorStringLength = chractorString.length;
        for(let i=0;i<length;i++){
            let randomIndex = Math.floor(Math.random()*chractorStringLength);
            Id += chractorString[randomIndex];
        }
        return Id;
    }
}

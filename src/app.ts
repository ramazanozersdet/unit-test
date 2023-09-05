import fs from "fs";
import path from "path";

export function readFile(fileName: string){
    let fileContent;
    try {
        fileContent= fs.readFileSync(path.resolve(__dirname, fileName), 'utf8');
        try{
            JSON.parse(fileContent);
            fileContent= JSON.parse(fileContent);
        }catch (err) {
            // @ts-ignore
            throw new Error(err);
        }
    }catch (error){
        // @ts-ignore
        throw new Error(error);
    }
    return fileContent;
}

function getLastName(text: string): string {
    const words = text.split(' ');
    return words.pop() || '';
}

function areWordsEqualCaseInsensitive(word1: string, word2: string): boolean {
    return word1.toLowerCase() === word2.toLowerCase();
}

function areWordsNotEqual(word1: string, word2: string): boolean {
    return word1.toLowerCase() !=  word2.toLowerCase();
}

export function IsNameMatched(fileA: object, fileB: object){
    let IsNameMatched = false;

    if(fileA.hasOwnProperty('Buyer')){
        // @ts-ignore
        if((fileA.Buyer).length>1){
            throw new Error('it can not be more than one buyer');
        }
        // @ts-ignore
        if(fileA.Buyer[0].length <= 0){
            throw new Error('Buyer data is not available');
        }
    }else{
        throw new Error('Json has not Buyer property');
    }
    // make sure DocumentType, Position, Vesting, Borrowers, ChildSeqIDs keys exist for FileA

    // @ts-ignore
    const AssessRecord = fileB.AssessRecord;
    if(AssessRecord.hasOwnProperty('Owners')){
        // @ts-ignore
        for(let i=0; i<AssessRecord.Owners.length; i++){
            if(AssessRecord.Owners[i].length <= 0){
                throw new Error('One or more of owner data is not available');
            }
        }
    }else{
        throw new Error('Json has not Owners property');
    }
    // make sure ID, Latitude, Addresses, Owners keys exist for FileB


    // @ts-ignore
    for(let i=0; i<AssessRecord.Owners.length; i++){
        const ownerFullName = AssessRecord.Owners[i];
        // @ts-ignore
        const buyerFullName = fileA.Buyer[0];

        const ownerLastName = getLastName(ownerFullName);
        const buyerLastName = getLastName(buyerFullName);

        const firstFourLetterOfOwnerLastName = ownerLastName.slice(0,4);
        const firstFourLetterOfBuyerLastName = buyerLastName.slice(0,4);

        if(areWordsEqualCaseInsensitive(firstFourLetterOfOwnerLastName, firstFourLetterOfBuyerLastName)){

            if(areWordsNotEqual(ownerLastName, buyerLastName)){
                throw new Error('The buyer\'s and the owner\'s last name do not match.');
            }
            if(areWordsNotEqual(ownerFullName, buyerFullName)){
                throw new Error('The buyer\'s and the owner\'s fullname do not match.');
            }

            IsNameMatched = true
        }
    }
    return IsNameMatched;
}

import {IsNameMatched, readFile} from '../app';

describe("IsNameMatched feature working as expected", () => {

    it("P: Verify Given Files are valid JSONs", async () => {
        expect(readFile('FileA.json')).toHaveProperty('DocumentType','Deed')
        expect(readFile('FileB.json')).toHaveProperty('AssessRecord.ID','123-111')
    });

    it("P: If Given Buyer and Owner Last Name Matched then Verify IsNameMatched will be true.", async () => {
        expect(IsNameMatched(readFile('FileA.json'), readFile('FileB.json'))).toBeTruthy();
    });

    it("P: If Given Buyer and Owner Last Name Not Matched then Verify IsNameMatched will be false.", async () => {
        expect(IsNameMatched(readFile('FileA.json'), readFile('FileBNotMatch.json'))).toBeFalsy();
    });

    it("N: If Given File is not valid JSON then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('invalidJSON.json'), readFile('FileB.json'));
        }).rejects.toThrow(`Error: SyntaxError: Unexpected token ']', ..."ohn D",\n  ],\n  "Docu"... is not valid JSON`);
    });

    it("N: If Given File is not JSON then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('textFile.txt'), readFile('FileB.json'));
        }).rejects.toThrow(`Error: SyntaxError: Unexpected token 'H', "Hello" is not valid JSON`); // ??
    });

    it("N: If There is No Buyer key in File A then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileAHasNoBuyer.json'), readFile('FileB.json'));
        }).rejects.toThrow(`Json has not Buyer property`);
    });

    it("N: If There are more than one Buyer in File A then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileAMoreThanOneBuyer.json'), readFile('FileB.json'));
        }).rejects.toThrow(`it can not be more than one buyer`);
    });

    it("N: If Buyer data is not available in File A then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileABuyerDataNotAvailable.json'), readFile('FileB.json'));
        }).rejects.toThrow(`Buyer data is not available`);
    });

    it("N: If There is No Owner key in File B then Verify the error message." , async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileA.json'), readFile('FileBHasNoOwner.json'));
        }).rejects.toThrow(`Json has not Owners property`);
    });

    it("N: If One or more owner data is not available in File B then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileA.json'), readFile('FileBOwnerDataNotAvailable.json'));
        }).rejects.toThrow(`One or more of owner data is not available`);
    });

    it("N: If Given Buyer and Owner Last Name Not Matched then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileA.json'), readFile('FileBLastNameNotSame.json'));
        }).rejects.toThrow(`The buyer's and the owner's last name do not match.`);
    });

    it("N: If Given Buyer and Owner Name Not Matched then Verify the error message.", async () => {
        await expect(async () => {
            IsNameMatched(readFile('FileA.json'), readFile('FileBNameNotSame.json'));
        }).rejects.toThrow(`The buyer's and the owner's fullname do not match.`);
    });
})
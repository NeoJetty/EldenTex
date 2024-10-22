// TabVoting.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadRandomUntaggedImage } from "./requestTextureData.js";
import { createVotingUI } from './votingYesNo.js';
class TabVoting {
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
    }
    // The new main function, renamed to updateAll
    updateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadRandomUntaggedImage();
            this.createVotingUI();
        });
    }
    // Load the random untagged image
    loadRandomUntaggedImage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield loadRandomUntaggedImage(this.parentDiv);
            }
            catch (error) {
                console.error('Error loading random untagged image:', error);
            }
        });
    }
    // Create the voting UI
    createVotingUI() {
        createVotingUI(this.parentDiv);
    }
}
export default TabVoting;

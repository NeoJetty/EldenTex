// TabVoting.ts

import { loadRandomUntaggedImage } from "./requestTextureData.js";
import { createVotingUI } from './votingYesNo.js';

class TabVoting {
    private parentDiv: HTMLDivElement;

    constructor(parentDiv: HTMLDivElement) {
        this.parentDiv = parentDiv;
    }

    // The new main function, renamed to updateAll
    public async updateAll(): Promise<void> {
        await this.loadRandomUntaggedImage();
        this.createVotingUI();
    }

    // Load the random untagged image
    private async loadRandomUntaggedImage(): Promise<void> {
        try {
            await loadRandomUntaggedImage(this.parentDiv);
        } catch (error) {
            console.error('Error loading random untagged image:', error);
        }
    }

    // Create the voting UI
    private createVotingUI(): void {
        createVotingUI(this.parentDiv);
    }
}

export default TabVoting;

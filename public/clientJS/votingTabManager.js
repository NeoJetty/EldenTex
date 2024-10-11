// votingTabManager.js

import { loadRandomUntaggedImage } from "./requestImageData.js";
import { createVotingUI } from './votingYesNo.js';

function runVotingTab() {
    loadRandomUntaggedImage();
    loadButtons();
    createVotingUI();
}

function loadButtons(){
    // hardcoded for now
}

export { runVotingTab };
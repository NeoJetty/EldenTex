// votingTabManager.js

import { loadRandomUntaggedImage } from "./requestImageData.js";
import { createVotingUI } from './votingYesNo.js';

function runVotingTab(parentDiv) {
    loadRandomUntaggedImage(parentDiv);
    loadButtons();
    createVotingUI(parentDiv);
}

function loadButtons(){
    // hardcoded for now
}

export { runVotingTab };
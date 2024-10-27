import { addTagtoTexture, removeTagFromTexture } from "./requestTagRelatedData.js";
var ToggleState;
(function (ToggleState) {
    ToggleState["ON"] = "on";
    ToggleState["OFF"] = "off";
    ToggleState["NEUTRAL"] = "neutral";
})(ToggleState || (ToggleState = {}));
class Toggle {
    constructor(tagID, textureID, name, initialState = ToggleState.NEUTRAL) {
        this.tagID = tagID;
        this.textureID = textureID;
        this.name = name;
        this.dbWriteListenerActive = true;
        this.state = initialState;
        this.element = this.createToggleElement();
        this.imgElement = this.element.querySelector('.toggle-image');
        this.element.addEventListener('click', this.onToggleClick.bind(this));
    }
    createToggleElement() {
        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('tag-toggle-container');
        const toggle = document.createElement('div');
        toggle.classList.add('tag-toggle');
        toggle.dataset.tagId = this.tagID.toString();
        toggle.dataset.state = this.state;
        const toggleImage = document.createElement('img');
        toggleImage.classList.add('toggle-image');
        toggleImage.src = this.getImageForState(this.state);
        toggle.appendChild(toggleImage);
        // Add the label for the tag toggle
        const label = document.createElement('label');
        label.textContent = `${this.name}`;
        // Append label and toggle elements to the container 
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(label);
        return toggleContainer;
    }
    onToggleClick() {
        this.toggleState();
        this.updateImage();
        if (this.dbWriteListenerActive) {
            this.handleDBWrite();
        }
    }
    toggleState() {
        if (this.state === ToggleState.ON) {
            this.state = ToggleState.OFF;
        }
        else if (this.state === ToggleState.OFF) {
            this.state = ToggleState.NEUTRAL;
        }
        else {
            this.state = ToggleState.ON;
        }
        this.element.dataset.state = this.state;
    }
    forceState(newState) {
        this.state = newState;
        this.element.dataset.state = this.state;
        this.updateImage();
    }
    updateImage() {
        this.imgElement.src = this.getImageForState(this.state);
    }
    handleDBWrite() {
        if (this.textureID === -1) { // Use comparison operator (===)
            console.error('Tried to edit tag from image_id -1.');
            return;
        }
        let vote = null; // Initialize vote as null
        // Set vote to true or false based on the current state
        if (this.state === ToggleState.ON) {
            vote = true;
        }
        else if (this.state === ToggleState.OFF) {
            vote = false;
        }
        if (vote !== null) {
            addTagtoTexture(this.tagID, this.textureID, vote);
        }
        else {
            removeTagFromTexture(this.tagID, this.textureID);
        }
    }
    getImageForState(state) {
        switch (state) {
            case ToggleState.ON:
                return 'UXimg/toggle_on.png';
            case ToggleState.OFF:
                return 'UXimg/toggle_off.png';
            case ToggleState.NEUTRAL:
            default:
                return 'UXimg/toggle_neutral.png';
        }
    }
    setDBWriteListenerActive(active) {
        this.dbWriteListenerActive = active;
    }
    get elementNode() {
        return this.element;
    }
    get currentState() {
        return this.state;
    }
}
export { ToggleState, Toggle };

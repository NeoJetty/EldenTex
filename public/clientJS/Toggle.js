// toggle.ts
import { AppConfig } from "./AppConfig";
// a simple checkbox-adjacent element and it's self-contained functionality. Wraps around this:
// <div class="tag-toggle" data-tag-id="1" data-state="neutral"><img src="UXimg/toggle_neutral.png" class="toggle-image"></div>
var ToggleState;
(function (ToggleState) {
    ToggleState["ON"] = "on";
    ToggleState["OFF"] = "off";
    ToggleState["NEUTRAL"] = "neutral";
})(ToggleState || (ToggleState = {}));
class Toggle {
    constructor(tagID, textureID, initialState = ToggleState.NEUTRAL) {
        this.tagID = tagID;
        this.textureID = textureID;
        this.dbWriteListenerActive = true;
        this.state = initialState;
        this.element = this.createToggleElement();
        this.imgElement = this.element.querySelector('.toggle-image');
        this.element.addEventListener('click', this.onToggleClick.bind(this));
    }
    createToggleElement() {
        const toggle = document.createElement('div');
        toggle.classList.add('tag-toggle');
        toggle.dataset.tagId = this.tagID.toString();
        toggle.dataset.state = this.state;
        const toggleImage = document.createElement('img');
        toggleImage.classList.add('toggle-image');
        toggleImage.src = this.getImageForState(this.state);
        toggle.appendChild(toggleImage);
        return toggle;
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
        // explicitly no DB update
    }
    updateImage() {
        this.imgElement.src = this.getImageForState(this.state);
    }
    handleDBWrite() {
        const vote = this.state === ToggleState.ON ? 'true' : this.state === ToggleState.OFF ? 'false' : null;
        if (vote !== null) {
            const url = `/dbAddTagToTexture?user_id=${AppConfig.user.ID}&tag_id=${this.tagID}&texture_id=${this.textureID}&vote=${vote}`;
            fetch(url)
                .then(response => response.ok ? response.json() : Promise.reject(response))
                .then(data => console.log(`Tag ${this.tagID} set to ${this.state}. Response:`, data))
                .catch(error => console.error('Error updating tag:', error));
        }
        else {
            this.removeTagFromDB();
        }
    }
    removeTagFromDB() {
        const url = `/dbDeleteTagFromTexture/${AppConfig.user.ID}/${this.tagID}/${this.textureID}`;
        fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => console.log(`Tag ${this.tagID} removed. Response:`, data))
            .catch(error => console.error('Error removing tag:', error));
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

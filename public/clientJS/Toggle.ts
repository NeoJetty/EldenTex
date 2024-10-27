// toggle.ts
import { AppConfig } from "./AppConfig.js";
import { addTagtoTexture, removeTagFromTexture } from "./requestTagRelatedData.js"

enum ToggleState {
    ON = 'on',
    OFF = 'off',
    NEUTRAL = 'neutral'
}

class Toggle {
    private state: ToggleState;
    private element: HTMLElement;
    private imgElement: HTMLImageElement;
    private dbWriteListenerActive: boolean = true;
    
    constructor(
        public tagID: number,
        public textureID: number,
        private name: string,
        initialState: ToggleState = ToggleState.NEUTRAL
    ) {
        this.state = initialState;
        this.element = this.createToggleElement();
        this.imgElement = this.element.querySelector('.toggle-image') as HTMLImageElement;

        this.element.addEventListener('click', this.onToggleClick.bind(this));
    }

    private createToggleElement(): HTMLElement {
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

    private onToggleClick(): void {
        this.toggleState();
        this.updateImage();

        if (this.dbWriteListenerActive) {
            this.handleDBWrite();
        }
    }

    private toggleState(): void {
        if (this.state === ToggleState.ON) {
            this.state = ToggleState.OFF;
        } else if (this.state === ToggleState.OFF) {
            this.state = ToggleState.NEUTRAL;
        } else {
            this.state = ToggleState.ON;
        }
        this.element.dataset.state = this.state;
    }

    public forceState(newState: ToggleState): void {
        this.state = newState;
        this.element.dataset.state = this.state;
        this.updateImage();
    }

    private updateImage(): void {
        this.imgElement.src = this.getImageForState(this.state);
    }

    private handleDBWrite(): void {
        if (this.textureID === -1) { // Use comparison operator (===)
            console.error('Tried to edit tag from image_id -1.');
            return;
        }

        let vote: boolean | null = null; // Initialize vote as null
    
        // Set vote to true or false based on the current state
        if (this.state === ToggleState.ON) {
            vote = true;
        } else if (this.state === ToggleState.OFF) {
            vote = false;
        }
    
        if (vote !== null) {
            addTagtoTexture(this.tagID, this.textureID, vote);
        } else {
            removeTagFromTexture(this.tagID, this.textureID);
        }
    }

    private getImageForState(state: ToggleState): string {
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

    public setDBWriteListenerActive(active: boolean): void {
        this.dbWriteListenerActive = active;
    }

    public get elementNode(): HTMLElement {
        return this.element;
    }

    public get currentState(): ToggleState {
        return this.state;
    }
}



export { ToggleState, Toggle }

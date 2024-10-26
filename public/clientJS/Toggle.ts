// toggle.ts
import { AppConfig } from "./AppConfig.js";

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
        private tagID: number,
        private textureID: number,
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
        const vote = this.state === ToggleState.ON ? 'true' : this.state === ToggleState.OFF ? 'false' : null;
        
        if (vote !== null) {
            const url = `/dbAddTagToTexture?user_id=${AppConfig.user.ID}&tag_id=${this.tagID}&texture_id=${this.textureID}&vote=${vote}`;
            fetch(url)
                .then(response => response.ok ? response.json() : Promise.reject(response))
                .then(data => console.log(`Tag ${this.tagID} set to ${this.state}. Response:`, data))
                .catch(error => console.error('Error updating tag:', error));
        } else {
            this.removeTagFromDB();
        }
    }

    private removeTagFromDB(): void {
        const url = `/dbDeleteTagFromTexture/${AppConfig.user.ID}/${this.tagID}/${this.textureID}`;
        fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => console.log(`Tag ${this.tagID} removed. Response:`, data))
            .catch(error => console.error('Error removing tag:', error));
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

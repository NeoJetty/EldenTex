// tagList.ts

import { AppConfig } from './AppConfig';
import { Toggle, ToggleState } from './Toggle';

interface Tag {
    id: number;
    name: string;
    category: string;
}

interface TagVote {
    tag_id: number;
    vote: boolean;
}

class TagList {
    private tagContainer: HTMLDivElement;
    private textureID: number;
    private preCheckedTagIDs: TagVote[];

    constructor(tagContainer: HTMLDivElement, textureID: number, preCheckedTagIDs: TagVote[] = []) {
        this.tagContainer = tagContainer;
        this.textureID = textureID;
        this.preCheckedTagIDs = preCheckedTagIDs;
    }

    public async buildTagList(): Promise<void> {
        try {
            const tags = await this.fetchAllTags();
            tags.forEach(tag => this.createToggleForTag(tag));
        } catch (error) {
            console.error("Failed to build tag list:", error);
        }
    }

    private async fetchAllTags(): Promise<Tag[]> {
        const response = await fetch('/allTags');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.tags as Tag[];
    }

    private createToggleForTag(tag: Tag): void {
        // Check if this tag is in the pre-checked list
        const tagVote = this.preCheckedTagIDs.find(tv => tv.tag_id === tag.id);
        const initialState = tagVote ? (tagVote.vote ? ToggleState.ON : ToggleState.OFF) : ToggleState.NEUTRAL;

        // Create the Toggle instance
        const toggle = new Toggle(tag.id, this.textureID, initialState);
        
        // Attach the toggle element to the container
        this.tagContainer.appendChild(toggle.elementNode);

        // Add the label for the tag toggle
        const label = document.createElement('label');
        label.textContent = `${tag.name} (${tag.category})`;
        this.tagContainer.appendChild(label);
        this.tagContainer.appendChild(document.createElement('br')); // Optional line break
    }
}

export { TagList, TagVote };

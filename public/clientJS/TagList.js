// tagList.ts
import { Toggle, ToggleState } from './Toggle';
class TagList {
    constructor(tagContainer, textureID, preCheckedTagIDs = []) {
        this.tagContainer = tagContainer;
        this.textureID = textureID;
        this.preCheckedTagIDs = preCheckedTagIDs;
    }
    async buildTagList() {
        try {
            const tags = await this.fetchAllTags();
            tags.forEach(tag => this.createToggleForTag(tag));
        }
        catch (error) {
            console.error("Failed to build tag list:", error);
        }
    }
    async fetchAllTags() {
        const response = await fetch('/allTags');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.tags;
    }
    createToggleForTag(tag) {
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
export { TagList };

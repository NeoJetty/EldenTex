import { AppConfig } from './AppConfig.js';

class TabGallery {
    public contentDiv: HTMLDivElement;

    constructor(contentDiv: HTMLDivElement) {
        this.contentDiv = contentDiv;
    }

    // Fetch textures based on user ID, tag ID, and page number
    private async fetchManyTextures(userId: number, tagID: number, page: number): Promise<any> {
        const response = await fetch(`/serveManyTextures/${userId}/${tagID}?page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    // Update the gallery tab content
    public async updateAll(): Promise<void> {
        if (AppConfig.galleryTab.tagID === -1) {
            await this.constructTagsDropdownMenu(this.contentDiv);
        } else {
            const textures = await this.fetchTextureDataset(AppConfig.galleryTab.tagID, 1);
            this.buildImageGrid(textures, 1);
            this.updatePagination(textures.length, 1);
        }
    }

    // Fetch the texture dataset based on tag ID and page number
    private async fetchTextureDataset(tagID: number, page: number): Promise<any[]> {
        try {
            let userID = AppConfig.user.ID;
            const textures = await this.fetchManyTextures(userID, tagID, page);
            if (AppConfig.debug.level === 2) {
                console.log(`Fetching textures with User ID: ${userID}, Tag ID: ${tagID}, Page: ${page}`);
                console.log('Fetched textures:', textures);
            }
            // Update AppConfig with the fetched texture data
            AppConfig.updateGalleryDataset(textures, tagID);
            return textures;
        } catch (error) {
            console.error(`Error fetching textures for tag ID ${tagID}:`, error);
            return []; // Return an empty array on error
        }
    }

    // Construct the tags dropdown menu
    private async constructTagsDropdownMenu(targetDiv: HTMLElement): Promise<void> {
        try {
            const response = await this.fetchAllTags();
            const tags = response.tags;

            if (Array.isArray(tags)) {
                const dropdownMenuElement = targetDiv.querySelector('#textureType') as HTMLSelectElement;

                if (!dropdownMenuElement) {
                    console.error(`DropdownMenu HTML element not found in: ${targetDiv}`);
                    return;
                }

                // Build the dropdown menu
                this.buildDropdownMenu(dropdownMenuElement, tags);
            } else {
                console.error('Expected an array of tags, but got:', tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
            targetDiv.innerHTML = 'Error loading tags.';
        }
    }

    // Build the dropdown menu
    private buildDropdownMenu(dropdown: HTMLSelectElement, tags: any[]): void {
        dropdown.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.textContent = '-- choose --';
        defaultOption.value = '';
        dropdown.appendChild(defaultOption);

        tags.forEach(tag => {
            const option = document.createElement('option');
            option.textContent = tag.name;
            option.value = tag.id.toString();
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', (event: Event) => {
            const selectedTagId = (event.target as HTMLSelectElement).value;
            this.changeGalleryPage(Number(selectedTagId), 1);
        });
    }

    // Change the gallery page and refresh the content
    private async changeGalleryPage(tagID: number, page: number): Promise<void> {
        if (AppConfig.debug.level === 2) {
            console.log(`Refreshing gallery page: ${page} for tag: ${tagID}`);
        }

        if (tagID !== AppConfig.galleryTab.tagID) {
            const textures = await this.fetchTextureDataset(tagID, page);
            this.buildImageGrid(textures, page);
            this.updatePagination(textures.length, page);
        } else {
            this.buildImageGrid(AppConfig.galleryTab.allTextureData, page);
            this.updatePagination(AppConfig.galleryTab.allTextureData.length, page);
        }
    }

    // Build the image grid
    private buildImageGrid(textures: any[], page: number): void {
        const imageGrid = document.getElementById('gallery-image-grid');
        if (!imageGrid) return;

        const pagedTextures = textures.slice((page - 1) * 21, page * 21);
        const images = imageGrid.getElementsByTagName('img');

        pagedTextures.forEach((texture, index) => {
            if (images[index]) {
                images[index].src = AppConfig.buildLowQualityJPGPath(texture.textureName, texture.textureTypes);
                images[index].alt = `${texture.id}`;
            }
        });

        for (let i = pagedTextures.length; i < images.length; i++) {
            images[i].src = '/UXimg/image_not_available.png';
            images[i].style.display = 'block';
        }
    }

    // Update pagination
    private updatePagination(totalTextures: number, currentPage: number): void {
        const itemsPerPage = 21;
        const totalPages = Math.ceil(totalTextures / itemsPerPage);
        const pageNumbersContainer = document.getElementById('pageNumbers');
        const pagination = document.getElementById('pagination');

        if (!pageNumbersContainer || !pagination) return;

        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i.toString();

            if (i === currentPage) {
                pageLink.classList.add('active');
            }

            pageLink.addEventListener('click', (e: Event) => {
                e.preventDefault();
                this.changeGalleryPage(AppConfig.galleryTab.tagID, i);
            });

            pageNumbersContainer.appendChild(pageLink);
        }

        const prevButton = pagination.querySelector('.prev') as HTMLElement;
        const nextButton = pagination.querySelector('.next') as HTMLElement;

        if (prevButton) prevButton.style.display = currentPage > 1 ? 'inline' : 'none';
        if (nextButton) nextButton.style.display = currentPage < totalPages ? 'inline' : 'none';
    }

    // Fetch all tags
    private async fetchAllTags(): Promise<any> {
        const response = await fetch('/allTags');
        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }

        const data = await response.json();
        if (AppConfig.debug.level === 2) {
            console.log('Response from /allTags:', data);
        }
        return data;
    }
}

export default TabGallery;

import { IMAGE_FOLDERS } from "../../data/utils/constants";
import { TextureSubtypes } from "./sharedTypes";

/**
 * Builds a JPG URL based on the texture name and texture types.
 *
 * @param textureName - Name of the texture.
 * @param textureTypes - Object containing the texture types.
 * @returns The constructed JPG URL.
 */
export const buildJPGPath = (
  textureName: string,
  textureTypes: TextureSubtypes
): string => {
  const basePath = IMAGE_FOLDERS.jpgs + textureName;

  if (textureTypes._n) {
    return basePath + "_n.jpg";
  }

  for (const key of Object.keys(textureTypes)) {
    if (textureTypes[key as keyof TextureSubtypes]) {
      return basePath + key + ".jpg";
    }
  }

  console.error(
    `200 Error: No valid texture type found for texture name "${textureName}". Returning default path.`
  );
  return basePath + ".jpg"; // Default path
};

/**
 * Builds a low-quality JPG URL based on the texture name and texture types.
 *
 * @param textureName - Name of the texture.
 * @param textureTypes - Object containing the texture types.
 * @returns The constructed low-quality JPG URL.
 */
export const buildLowQualityJPGPath = (
  textureName: string,
  textureTypes: TextureSubtypes
): string => {
  const basePath = IMAGE_FOLDERS.jpgs + textureName;

  if (textureTypes._n) {
    return basePath + "_n_l.jpg";
  }

  for (const key of Object.keys(textureTypes)) {
    if (textureTypes[key as keyof TextureSubtypes]) {
      return basePath + key + "_l.jpg";
    }
  }

  console.error(
    `200 Error: No valid texture type found for texture name "${textureName}". Returning default path.`
  );
  return basePath + ".jpg"; // Default path
};

/**
 * Builds a PNG URL by converting a given JPG URL.
 *
 * @param jpgUrl - The original JPG URL.
 * @returns The corresponding PNG URL.
 */
export const buildPNGPath = (jpgUrl: string): string => {
  return jpgUrl
    .replace(IMAGE_FOLDERS.jpgs, IMAGE_FOLDERS.pngs)
    .replace(".jpg", ".png");
};

/**
 * Builds a JPG URL based on the texture name and a single texture type suffix.
 *
 * @param textureName - Name of the texture.
 * @param textureType - The texture type suffix (e.g., "_n", "_r").
 * @returns The constructed JPG URL.
 */
export const buildJPGPathFixSubtype = (
  textureName: string,
  textureType: string
): string => {
  const basePath = IMAGE_FOLDERS.jpgs + textureName;

  if (textureType) {
    return basePath + textureType + ".jpg";
  }

  console.error(
    `200 Error: No valid texture type provided for texture name "${textureName}". Returning default path.`
  );
  return basePath + ".jpg"; // Default path
};

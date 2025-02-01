export interface TextureSubtypes {
  [key: string]: boolean;
  _a: boolean;
  _n: boolean;
  _r: boolean;
  _v: boolean;
  _d: boolean;
  _em: boolean;
  _3m: boolean;
  _Billboards_a: boolean;
  _Billboards_n: boolean;
  _g: boolean;
  _m: boolean;
  _1m: boolean;
  _van: boolean;
  _vat: boolean;
}

export const emptyTextureSubtypes: TextureSubtypes = {
  _a: false,
  _n: false,
  _r: false,
  _v: false,
  _d: false,
  _em: false,
  _3m: false,
  _Billboards_a: false,
  _Billboards_n: false,
  _g: false,
  _m: false,
  _1m: false,
  _van: false,
  _vat: false,
};

export interface Tag {
  id: number;
  name: string;
  category: string;
}

export interface TagVote {
  tag_id: number;
  vote: boolean;
}

export interface SlicePacket {
  // slice_texture_associations
  ID: number;
  sliceID: number;
  textureID: number;
  topLeft: {
    x: number;
    y: number;
  };
  bottomRight: {
    x: number;
    y: number;
  };
  localDescription: string;
  confidence: number;
  linkUserID: number;

  // slices
  sliceName: string;
  globalDescription: string;
  sliceUserID: number; // is it possible to link to another users slice? probably
  textureSubtypeBase: string;
}

export interface Slice {
  id: number;
  sliceId: number;
  textureId: number;
  topLeft: {
    x: number;
    y: number;
  };
  bottomRight: {
    x: number;
    y: number;
  };
  localDescription: string;
  confidence: number;
  linkUserId: number;
  textureSubtypeBase: string;
}

export const emptySlice: Slice = {
  id: -1,
  sliceId: -1,
  textureId: -1,
  topLeft: { x: 0, y: 0 },
  bottomRight: { x: 0, y: 0 },
  localDescription: "",
  confidence: -1,
  linkUserId: -1,
  textureSubtypeBase: "",
};

export interface Symbol {
  id: number;
  sliceName: string;
  globalDescription: string;
  sliceUserId: number; // is it possible to link to another users slice? or always copy the slice to your own userID?
}

export const emptySymbol: Symbol = {
  id: -1,
  sliceName: "",
  globalDescription: "",
  sliceUserId: -1,
};

export interface SlicePacket2 {
  slice: Slice;
  symbol: Symbol;
}

export const emptySlicePacket: SlicePacket2 = {
  slice: emptySlice,
  symbol: emptySymbol,
};

/**
 * A point in 2D space with x and y coordinates.
 * @typedef {Object} T_xyPoint
 * @property {number} x - The x-coordinate (left-right)
 * @property {number} y - The y-coordinate (top-bottom)
 */
export interface T_xyPoint {
  x: number; // left-right
  y: number; // top-bottom
}

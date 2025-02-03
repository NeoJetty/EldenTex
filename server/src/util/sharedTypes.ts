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

export const emptyTextureTypes: TextureSubtypes = {
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

/**
 * Represents a user's vote on a tag.
 * @property tag_id - The ID of the tag.
 * @property vote - The user's vote, where true represents a positive vote and false represents a negative vote.
 */
export interface TagVote {
  tag_id: number;
  vote: boolean;
}

export interface TextureData {
  id: number;
  name: string;
  textureTypes: string[];
}

export interface Slice {
  id: number;
  symbolId: number;
  textureId: number;
  topLeft: {
    x: number;
    y: number;
  };
  bottomRight: {
    x: number;
    y: number;
  };
  description: string;
  confidence: number;
  userId: number;
  textureSubtypeBase: string;
}

export const emptySlice: Slice = {
  id: -1,
  symbolId: -1,
  textureId: -1,
  topLeft: { x: 0, y: 0 },
  bottomRight: { x: 0, y: 0 },
  description: "",
  confidence: -1,
  userId: -1,
  textureSubtypeBase: "",
};

export interface Symbol {
  id: number;
  name: string;
  description: string;
  userId: number; // is it possible to link to another users slice? or always copy the slice to your own userID?
}

export const emptySymbol: Symbol = {
  id: -1,
  name: "",
  description: "",
  userId: -1,
};

export interface SlicePacket {
  slice: Slice;
  symbol: Symbol;
}

export const emptySlicePacket: SlicePacket = {
  slice: emptySlice,
  symbol: emptySymbol,
};

export interface DbSliceLink {
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
  textureSubtypeBase: string;
}

export interface DbSlice {
  id: number;
  name: string;
  globalDescription: string;
  userID: number;
}

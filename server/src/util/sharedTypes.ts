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

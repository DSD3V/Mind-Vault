export interface UserI {
  email: string;
  token: string;
  userId: string;
}

export interface ThoughtI {
  html: string;
  thoughtId: string;
}

export interface VaultI {
  childVaults: VaultI[];
  imageUrl: string;
  name: string;
  thoughts: ThoughtI[];
  vaultId: string;
}

export interface VaultEditRequestI {
  newImage: string | File | null;
  newName: string;
  vaultId: string;
}

export interface MindStateI {
  didEditThoughts: boolean;
  didEnterOrExitVault: boolean;
  errorMessage: string;
  isLoading: boolean;
  vaultStack: VaultI[];
}

export interface ThoughtI {
  html: string;
  thoughtId: string;
}

export interface ThoughtStateI {
  addingThoughtErrorMessage: string;
  addingThoughtSuccessMessage: string;
  deletingThoughtErrorMessage: string;
  deletingThoughtSuccessMessage: string;
  editingThoughtsErrorMessage: string;
  editingThoughtsSuccessMessage: string;
  isAddingThought: boolean;
  isDeletingThought: boolean;
  isEditingThoughts: boolean;
}

interface UserI {
  email: string;
  token: string;
  userId: string;
}

export interface UserStateI {
  errorMessage: string;
  isLoading: boolean;
  isSignUpLoading: boolean;
  successMessage: '';
  userData: UserI;
}

export interface VaultEditRequestI {
  newImage: string | File | null;
  newName: string;
  vaultId: string;
}

export interface VaultI {
  childVaults: VaultI[];
  imageUrl: string;
  name: string;
  thoughts: ThoughtI[];
  vaultId: string;
}

export interface VaultStateI {
  addingVaultErrorMessage: string;
  addingVaultSuccessMessage: string;
  deletingVaultErrorMessage: string;
  deletingVaultSuccessMessage: string;
  editingVaultsErrorMessage: string;
  editingVaultsSuccessMessage: string;
  isAddingVault: boolean;
  isDeletingVault: boolean;
  isEditingVaults: boolean;
  reorderingVaultsErrorMessage: string;
}

import { createAction, Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { SetStateAction } from 'react';

import { bucket, imageUrlRoot } from '../aws';
import { VaultEditRequestI, VaultI } from '../interfaces';

export const ADD_VAULT_FAILED = createAction(
  'ADD_VAULT_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const ADD_VAULT_STARTED = createAction('ADD_VAULT_STARTED');
export const ADD_VAULT_SUCCEEDED = createAction(
  'ADD_VAULT_SUCCEEDED',
  ({
    newVault,
    successMessage,
  }: {
    newVault: VaultI;
    successMessage: string;
  }) => ({
    payload: { newVault, successMessage },
  })
);

export const CLEAR_ADD_VAULT_MESSAGES = createAction(
  'CLEAR_ADD_VAULT_MESSAGES'
);
export const CLEAR_DELETE_VAULT_MESSAGES = createAction(
  'CLEAR_DELETE_VAULT_MESSAGES'
);
export const CLEAR_EDIT_VAULTS_MESSAGES = createAction(
  'CLEAR_EDIT_VAULTS_MESSAGES'
);
export const CLEAR_REORDER_VAULTS_MESSAGES = createAction(
  'CLEAR_REORDER_VAULTS_MESSAGES'
);

export const DELETE_VAULT_FAILED = createAction(
  'DELETE_VAULT_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const DELETE_VAULT_STARTED = createAction('DELETE_VAULT_STARTED');
export const DELETE_VAULT_SUCCEEDED = createAction(
  'DELETE_VAULT_SUCCEEDED',
  ({
    deletedVaultId,
    successMessage,
  }: {
    deletedVaultId: string;
    successMessage: string;
  }) => ({
    payload: { deletedVaultId, successMessage },
  })
);

export const EDIT_VAULTS_FAILED = createAction(
  'EDIT_VAULTS_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const EDIT_VAULTS_STARTED = createAction('EDIT_VAULTS_STARTED');
export const EDIT_VAULTS_SUCCEEDED = createAction(
  'EDIT_VAULTS_SUCCEEDED',
  ({
    successMessage,
    vaultEditRequests,
  }: {
    successMessage: string;
    vaultEditRequests: VaultEditRequestI[];
  }) => ({
    payload: { successMessage, vaultEditRequests },
  })
);

export const ENTER_ROOT_VAULT = createAction('ENTER_ROOT_VAULT');
export const ENTER_VAULT = createAction('ENTER_VAULT', ({ vaultToEnter }) => ({
  payload: { vaultToEnter },
}));
export const EXIT_VAULT = createAction('EXIT_VAULT');

export const REORDER_VAULTS_FAILED = createAction(
  'REORDER_VAULTS_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const REORDER_VAULTS_IN_STATE = createAction(
  'REORDER_VAULTS_IN_STATE',
  ({ newIndex, oldIndex }: { newIndex: number; oldIndex: number }) => ({
    payload: { newIndex, oldIndex },
  })
);
export const REORDER_VAULTS_STARTED = createAction('REORDER_VAULTS_STARTED');
export const REORDER_VAULTS_SUCCEEDED = createAction(
  'REORDER_VAULTS_SUCCEEDED'
);

const addVaultFailedMessage = 'Failed to add new vault.';
const addVaultImageFailedMessage =
  'Failed to add new vault: there was en error with the uploaded image.';
const addVaultSucceededMessage = 'Vault added.';

const deleteVaultFailedMessage = 'Failed to delete vault: an error occurred.';
const deleteVaultSucceededMessage = 'Vault deleted.';

const editVaultsFailedMessage =
  'Failed to save vault changes: an error occurred.';
const editVaultsSucceededMessage = 'Vault changes saved.';

const reorderVaultsFailedMessage =
  'Failed to reorder vaults: an error occured.';

export const addVault =
  ({
    newVaultImgFile,
    newVaultName,
    orderIndex,
    parentVaultId,
    setVaultNames,
    userId,
  }: {
    newVaultImgFile: File | null;
    newVaultName: string;
    orderIndex: number;
    parentVaultId: string;
    setVaultNames: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
    userId: string;
  }) =>
  async (dispatch: Dispatch) => {
    dispatch(ADD_VAULT_STARTED());
    try {
      if (newVaultImgFile) {
        bucket
          .putObject({
            Body: newVaultImgFile,
            Bucket: process.env.REACT_APP_S3_BUCKET || '',
            Key: newVaultImgFile.name,
          })
          .on(
            'httpUploadProgress',
            async ({ loaded, total }: { loaded: number; total: number }) => {
              if (Math.round((loaded / total) * 100) === 100) {
                const imageUrl = imageUrlRoot + newVaultImgFile.name;
                try {
                  const {
                    data: { newVault },
                  } = await axios.post('/vault/addVault', null, {
                    params: {
                      imageUrl,
                      name: newVaultName,
                      orderIndex,
                      parentVaultId,
                      userId,
                    },
                  });
                  setVaultNames(
                    (prevVaultNames: { [key: string]: string }) => ({
                      ...prevVaultNames,
                      [newVault.vaultId]: newVault.name,
                    })
                  );
                  dispatch(
                    ADD_VAULT_SUCCEEDED({
                      newVault,
                      successMessage: addVaultSucceededMessage,
                    })
                  );
                } catch (error) {
                  console.error(error);
                  dispatch(
                    ADD_VAULT_FAILED({
                      errorMessage: addVaultFailedMessage,
                    })
                  );
                }
              }
            }
          )
          .send(error => {
            if (error) {
              console.error(error);
              dispatch(
                ADD_VAULT_FAILED({
                  errorMessage: addVaultImageFailedMessage,
                })
              );
            }
          });
      } else {
        try {
          const {
            data: { newVault },
          } = await axios.post('/vault/addVault', null, {
            params: {
              imageUrl: '',
              name: newVaultName,
              orderIndex,
              parentVaultId,
              userId,
            },
          });
          dispatch(
            ADD_VAULT_SUCCEEDED({
              newVault,
              successMessage: addVaultSucceededMessage,
            })
          );
          setVaultNames((prevVaultNames: { [key: string]: string }) => ({
            ...prevVaultNames,
            [newVault.vaultId]: newVault.name,
          }));
        } catch (error) {
          console.error(error);
          dispatch(ADD_VAULT_FAILED({ errorMessage: addVaultFailedMessage }));
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(ADD_VAULT_FAILED({ errorMessage: addVaultFailedMessage }));
    }
  };

export const deleteVault =
  ({
    setVaultNames,
    vaultToDeleteId,
  }: {
    setVaultNames: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
    vaultToDeleteId: string;
  }) =>
  async (dispatch: Dispatch) => {
    dispatch(DELETE_VAULT_STARTED());
    try {
      await axios.delete('/vault/deleteVault', {
        data: { vaultId: vaultToDeleteId },
      });
      dispatch(
        DELETE_VAULT_SUCCEEDED({
          deletedVaultId: vaultToDeleteId,
          successMessage: deleteVaultSucceededMessage,
        })
      );
      setVaultNames((prevVaultNames: { [key: string]: string }) =>
        Object.fromEntries(
          Object.entries(prevVaultNames).filter(
            ([key, _]) => key !== vaultToDeleteId
          )
        )
      );
    } catch (error) {
      console.error(error);
      dispatch(DELETE_VAULT_FAILED({ errorMessage: deleteVaultFailedMessage }));
    }
  };

export const editVaults =
  ({ vaultEditRequests }: { vaultEditRequests: VaultEditRequestI[] }) =>
  async (dispatch: Dispatch) => {
    dispatch(EDIT_VAULTS_STARTED());
    const imageUploadPromises = [] as Promise<null>[];

    vaultEditRequests.forEach((editRequest, idx) => {
      const { newImage } = editRequest;
      if (newImage instanceof File) {
        imageUploadPromises.push(
          new Promise(resolve => {
            bucket
              .putObject({
                Body: newImage,
                Bucket: process.env.REACT_APP_S3_BUCKET || '',
                Key: newImage.name,
              })
              .on(
                'httpUploadProgress',
                async ({
                  loaded,
                  total,
                }: {
                  loaded: number;
                  total: number;
                }) => {
                  if (Math.round((loaded / total) * 100) === 100) {
                    const imageUrl = imageUrlRoot + newImage.name;
                    vaultEditRequests[idx].newImage = imageUrl;
                    resolve(null);
                  }
                }
              )
              .send(error => {
                if (error) {
                  console.error(error);
                  editRequest.newImage = null;
                  resolve(null);
                }
              });
          })
        );
      }
    });

    Promise.all(imageUploadPromises).then(async () => {
      try {
        await axios.patch('/vault/editVaults', {
          vaultEditRequests,
        });
        dispatch(
          EDIT_VAULTS_SUCCEEDED({
            successMessage: editVaultsSucceededMessage,
            vaultEditRequests,
          })
        );
      } catch (error) {
        console.error(error);
        dispatch(
          EDIT_VAULTS_FAILED({
            errorMessage: editVaultsFailedMessage,
          })
        );
      }
    });
  };

export const enterVault =
  ({
    isEnteringRoot,
    vaultToEnter,
  }: {
    isEnteringRoot?: boolean;
    vaultToEnter?: VaultI;
  }) =>
  async (dispatch: Dispatch) => {
    dispatch(CLEAR_ADD_VAULT_MESSAGES());
    dispatch(CLEAR_DELETE_VAULT_MESSAGES());
    dispatch(CLEAR_EDIT_VAULTS_MESSAGES());
    dispatch(
      isEnteringRoot ? ENTER_ROOT_VAULT() : ENTER_VAULT({ vaultToEnter })
    );
  };

export const exitVault = () => async (dispatch: Dispatch) => {
  dispatch(CLEAR_ADD_VAULT_MESSAGES());
  dispatch(CLEAR_DELETE_VAULT_MESSAGES());
  dispatch(CLEAR_EDIT_VAULTS_MESSAGES());
  dispatch(EXIT_VAULT());
};

export const reorderVaults =
  ({ vaults }: { vaults: VaultI[] }) =>
  async (dispatch: Dispatch) => {
    dispatch(REORDER_VAULTS_STARTED());
    try {
      await axios.patch('/vault/reorderVaults', {
        vaults,
      });
      dispatch(REORDER_VAULTS_SUCCEEDED());
    } catch (error) {
      console.error(error);
      dispatch(
        REORDER_VAULTS_FAILED({
          errorMessage: reorderVaultsFailedMessage,
        })
      );
    }
  };

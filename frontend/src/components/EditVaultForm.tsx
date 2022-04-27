import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { deleteVault } from '../actions/vaultActions';
import { DeleteModal } from './DeleteModal';
import defaultVaultImgUrl from '../images/vaultPic.jpg';
import { VaultEditRequestI, VaultI } from '../interfaces';
import {
  selectDeletingVaultErrorMessage,
  selectIsDeletingVault,
} from '../selectors/vaultSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { ErrorMessage2 } from '../styles/FormStyles';
import { Div, EmptySpan, NameInputField, X } from '../styles/GlobalStyles';
import {
  EditVaultCell,
  EditVaultImage,
  EmptyVaultImage,
  VaultImageFileInput,
  VaultImageText,
} from '../styles/VaultStyles';
import {
  IMAGE_FILE_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  VAULT_NAME_EXISTS_ERROR_MESSAGE,
  VAULT_NAME_NULL_ERROR_MESSAGE,
} from '../constants';

export const EditVaultForm = ({
  isActive,
  setEditErrors,
  setVaultEditRequests,
  setVaultNames,
  vault,
  vaultNames,
}: {
  handle?: boolean;
  id?: null | string;
  isActive?: boolean;
  isOver?: boolean;
  setEditErrors: React.Dispatch<SetStateAction<Set<string>>>;
  setVaultEditRequests: React.Dispatch<SetStateAction<VaultEditRequestI[]>>;
  setVaultNames: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
  vault: VaultI;
  vaultNames: { [key: string]: string };
}) => {
  const defaultVaultFormValues = {
    didVaultNameChange: false,
    vaultImage: vault.imageUrl,
    vaultName: vault.name,
  } as {
    didVaultNameChange: boolean;
    vaultImage: File | null | string;
    vaultName: string;
  };
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultVaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: vault.vaultId,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'none',
  };

  const dispatch = useAppDispatch();
  const deletingVaultErrorMessage = useAppSelector(
    selectDeletingVaultErrorMessage
  );
  const isDeletingVault = useAppSelector(selectIsDeletingVault);

  const [defaultVaultImageFile, setDefaultVaultImageFile] = useState(
    {} as File
  );
  const [vaultImageErrorMessage, setVaultImageErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const numErrors = Object.keys(errors).length;
  const vaultImage = watch('vaultImage');
  const vaultName = watch('vaultName');

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

  useEffect(() => {
    setEditErrors(prevEditErrors => {
      const editErrors = new Set(prevEditErrors);
      if (!numErrors) {
        editErrors.delete(vault.vaultId);
      } else {
        editErrors.add(vault.vaultId);
      }
      return editErrors;
    });
  }, [numErrors, setEditErrors, vault.vaultId]);

  useLayoutEffect(() => {
    (async () => {
      const response = await fetch(defaultVaultImgUrl);
      const blob = await response.blob();
      const file = new File([blob], defaultVaultImgUrl, { type: blob.type });
      setDefaultVaultImageFile(file);
    })();
  }, []);

  const handleDeleteVault = () => {
    if (isDeletingVault) {
      return;
    }
    dispatch(
      deleteVault({
        setVaultNames,
        vaultToDeleteId: vault.vaultId,
      })
    );
  };

  const handleInputChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setVaultNames((prevVaultNames: { [key: string]: string }) => ({
      ...prevVaultNames,
      [vault.vaultId]: value,
    }));
    setVaultEditRequests(prevVaultEditRequests => {
      const editRequests = [...prevVaultEditRequests];
      const idx = editRequests.findIndex(
        editRequest => editRequest.vaultId === vault.vaultId
      );
      if (idx !== -1) {
        editRequests[idx].newName = value;
      } else {
        editRequests.push({
          newImage: vault.imageUrl,
          newName: value,
          vaultId: vault.vaultId,
        });
      }
      return editRequests;
    });
  };

  const uploadImageHelper = ({ newImage }: { newImage: File | null }) => {
    setVaultEditRequests(prevVaultEditRequests => {
      const editRequests = [...prevVaultEditRequests];
      const idx = editRequests.findIndex(
        editRequest => editRequest.vaultId === vault.vaultId
      );
      if (idx !== -1) {
        editRequests[idx].newImage = newImage;
      } else {
        editRequests.push({
          newImage,
          newName: vaultName,
          vaultId: vault.vaultId,
        });
      }
      return editRequests;
    });
  };

  const handleUploadFile = ({
    target: { files },
  }: {
    target: { files: FileList | null };
  }) => {
    if (!(files![0].type.slice(0, 5) === 'image')) {
      setVaultImageErrorMessage(IMAGE_FILE_ERROR_MESSAGE);
    } else {
      setVaultImageErrorMessage('');
      setValue('vaultImage', files![0]);
      uploadImageHelper({ newImage: files![0] });
    }
  };

  const handleDefaultImage = () => {
    setVaultImageErrorMessage('');
    setValue('vaultImage', defaultVaultImageFile);
    uploadImageHelper({ newImage: defaultVaultImageFile });
  };

  const handleRemoveImage = () => {
    setVaultImageErrorMessage('');
    setValue('vaultImage', null);
    uploadImageHelper({ newImage: null });
  };

  return (
    <EditVaultCell $isActive={isActive} ref={setNodeRef} style={style}>
      <DeleteModal
        bodyText='Are you sure you want to delete this vault? All associated thoughts
          and inner vaults will also be deleted.'
        deleteText={isDeletingVault ? 'Deleting Vault...' : 'Delete'}
        errorMessage={deletingVaultErrorMessage}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteVault}
        shouldShow={isDeleteModalOpen}
        title={vault.name}
      />
      <Div $j='space-between' $m='-5px 0 5px 0' $p='0 6px'>
        <FontAwesomeIcon
          {...attributes}
          {...listeners}
          className='dragIcon'
          icon={faGripVertical}
          size='2x'
        />
        <X onClick={handleOpenDeleteModal}>X</X>
      </Div>
      <NameInputField
        {...register('vaultName', {
          onChange: handleInputChange,
          required: {
            message: REQUIRED_ERROR_MESSAGE,
            value: true,
          },
          validate: {
            doesntExist: value =>
              !(
                Object.values(vaultNames).includes(value) &&
                vaultNames.newVault !== value
              ) || VAULT_NAME_EXISTS_ERROR_MESSAGE,
            isntNull: value => !!value.trim() || VAULT_NAME_NULL_ERROR_MESSAGE,
          },
        })}
        placeholder={'New Vault Name (Required)'}
      />
      <ErrorMessage2>
        {errors.vaultName ? (
          errors.vaultName.message
        ) : (
          <EmptySpan>&nbsp;</EmptySpan>
        )}
      </ErrorMessage2>
      {!!vaultImage ? (
        <EditVaultImage
          src={
            typeof vaultImage === 'string'
              ? vaultImage
              : URL.createObjectURL(vaultImage)
          }
        />
      ) : (
        <EmptyVaultImage />
      )}
      <VaultImageFileInput
        accept='image/*'
        onChange={handleUploadFile}
        type='file'
      />
      <Div>
        <VaultImageText onClick={handleRemoveImage}>Remove</VaultImageText>
        <VaultImageText onClick={handleDefaultImage}>
          Use Default
        </VaultImageText>
      </Div>
      <Div>
        {vaultImageErrorMessage ? (
          <ErrorMessage2>{vaultImageErrorMessage}</ErrorMessage2>
        ) : (
          <EmptySpan>&nbsp;</EmptySpan>
        )}
      </Div>
    </EditVaultCell>
  );
};

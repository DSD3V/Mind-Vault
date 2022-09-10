import { Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { addVault, CLEAR_ADD_VAULT_MESSAGES } from '../actions/vaultActions';
import { IMAGE_FILE_ERROR_MESSAGE, REQUIRED_ERROR_MESSAGE, VAULT_NAME_EXISTS_ERROR_MESSAGE } from '../constants';
import defaultVaultImgUrl from '../images/vaultPic.jpg';
import { selectUserId } from '../selectors/userSelectors';
import {
  selectAddingVaultErrorMessage,
  selectAddingVaultSuccessMessage,
  selectIsAddingVault,
} from '../selectors/vaultSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { ErrorMessage2, SuccessMessage2 } from '../styles/FormStyles';
import { Button, Div, EmptySpan, FileInput, NameInputField } from '../styles/GlobalStyles';
import { EditVaultCell, EditVaultImage, EmptyVaultImage, VaultImageText } from '../styles/VaultStyles';

const defaultFormValues = {
  didNewVaultNameChange: false,
  newVaultImgFile: null,
  newVaultName: '',
} as {
  didNewVaultNameChange: boolean;
  newVaultImgFile: File | null;
  newVaultName: string;
};

export const NewVaultForm = ({
  parentVaultId,
  setVaultNames,
  vaultNames,
}: {
  parentVaultId: string;
  setVaultNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  vaultNames: { [key: string]: string };
}) => {
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const dispatch = useAppDispatch();
  const addingVaultErrorMessage = useAppSelector(selectAddingVaultErrorMessage);
  const addingVaultSuccessMessage = useAppSelector(selectAddingVaultSuccessMessage);
  const isAddingVault = useAppSelector(selectIsAddingVault);
  const userId = useAppSelector(selectUserId);

  const [defaultVaultImageFile, setDefaultVaultImageFile] = useState({} as File);
  const [newVaultImageErrorMessage, setNewVaultImageErrorMessage] = useState('');
  const [addedVaultName, setAddedVaultName] = useState('');

  const isAddNewVaultDisabled = isAddingVault || !!Object.keys(errors).length || !Object.keys(dirtyFields).length;
  const newVaultName = watch('newVaultName');
  const didNewVaultNameChange = watch('didNewVaultNameChange');

  useLayoutEffect(() => {
    (async () => {
      const response = await fetch(defaultVaultImgUrl);
      const blob = await response.blob();
      const file = new File([blob], defaultVaultImgUrl, { type: blob.type });
      setDefaultVaultImageFile(file);
      setValue('newVaultImgFile', file);
    })();
  }, [setValue]);

  const clearNewVaultMessages = useCallback(() => {
    if (addingVaultErrorMessage || addingVaultSuccessMessage) {
      dispatch(CLEAR_ADD_VAULT_MESSAGES());
    }
  }, [addingVaultErrorMessage, addingVaultSuccessMessage, dispatch]);

  useEffect(() => {
    if (!!addingVaultSuccessMessage && newVaultName === addedVaultName) {
      setValue('newVaultName', '');
    }
    if (didNewVaultNameChange && (!!addingVaultErrorMessage || !!addingVaultSuccessMessage)) {
      clearNewVaultMessages();
    }
  }, [
    addedVaultName,
    addingVaultErrorMessage,
    addingVaultSuccessMessage,
    clearNewVaultMessages,
    didNewVaultNameChange,
    newVaultName,
    setValue,
  ]);

  useEffect(() => {
    if (newVaultName) {
      setValue('didNewVaultNameChange', true);
    }
  }, [newVaultName, setValue]);

  const handleAddNewVaultClicked = handleSubmit(
    async ({ newVaultImgFile, newVaultName }: { newVaultImgFile: File | null; newVaultName: string }) => {
      if (isAddNewVaultDisabled) {
        return;
      }
      setValue('didNewVaultNameChange', false);
      setAddedVaultName(newVaultName);
      dispatch(
        addVault({
          newVaultImgFile,
          newVaultName,
          orderIndex: Object.keys(vaultNames).length - 1,
          parentVaultId,
          setVaultNames,
          userId,
        })
      );
    }
  );

  const handleInputChange = ({ target: { value } }: { target: { value: string } }) =>
    setVaultNames((prevVaultNames: { [key: string]: string }) => ({
      ...prevVaultNames,
      newVault: value,
    }));

  const handleUploadFile = ({ target: { files } }: { target: { files: FileList | null } }) => {
    if (!(files![0].type.slice(0, 5) === 'image')) {
      setNewVaultImageErrorMessage(IMAGE_FILE_ERROR_MESSAGE);
    } else {
      setNewVaultImageErrorMessage('');
      setValue('newVaultImgFile', files![0]);
      clearNewVaultMessages();
    }
  };

  return (
    <EditVaultCell>
      <Div $d="column">
        <NameInputField
          {...register('newVaultName', {
            onChange: handleInputChange,
            required: {
              message: REQUIRED_ERROR_MESSAGE,
              value: true,
            },
            validate: (value: string) =>
              !(Object.values(vaultNames).includes(value) && vaultNames.newVault !== value) ||
              VAULT_NAME_EXISTS_ERROR_MESSAGE,
          })}
          placeholder={'New Vault Name (Required)'}
        />
        <ErrorMessage2>
          {errors.newVaultName ? errors.newVaultName.message : <EmptySpan>&nbsp;</EmptySpan>}
        </ErrorMessage2>
        {watch('newVaultImgFile') ? (
          <EditVaultImage src={URL.createObjectURL(watch('newVaultImgFile')!)} />
        ) : (
          <EmptyVaultImage />
        )}
        <FileInput accept="image/*" onChange={handleUploadFile} type="file" />
      </Div>
      <Div>
        <VaultImageText
          onClick={() => {
            setNewVaultImageErrorMessage('');
            setValue('newVaultImgFile', null);
            clearNewVaultMessages();
          }}
        >
          Remove
        </VaultImageText>
        <VaultImageText
          onClick={() => {
            setNewVaultImageErrorMessage('');
            setValue('newVaultImgFile', defaultVaultImageFile);
            clearNewVaultMessages();
          }}
        >
          Use Default
        </VaultImageText>
      </Div>
      <Div>
        {newVaultImageErrorMessage ? (
          <ErrorMessage2>{newVaultImageErrorMessage}</ErrorMessage2>
        ) : (
          <EmptySpan>&nbsp;</EmptySpan>
        )}
      </Div>
      <Div $d="column">
        <Div>
          <Button
            $isDisabled={isAddNewVaultDisabled}
            onClick={isAddNewVaultDisabled ? () => {} : handleAddNewVaultClicked}
          >
            {isAddingVault ? 'Adding New Vault...' : 'Add New Vault'}
          </Button>
        </Div>
        {addingVaultErrorMessage && !addingVaultSuccessMessage ? (
          <ErrorMessage2>{addingVaultErrorMessage}</ErrorMessage2>
        ) : addingVaultSuccessMessage && !addingVaultErrorMessage ? (
          <SuccessMessage2>{addingVaultSuccessMessage}</SuccessMessage2>
        ) : (
          <SuccessMessage2>
            <EmptySpan>&nbsp;</EmptySpan>
          </SuccessMessage2>
        )}
      </Div>
    </EditVaultCell>
  );
};

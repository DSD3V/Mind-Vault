import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import {
  selectDeletingVaultSuccessMessage,
  selectEditingVaultsErrorMessage,
  selectEditingVaultsSuccessMessage,
  selectIsEditingVaults,
} from '../selectors/vaultSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { AlertDiv } from '../styles/GlobalStyles';

export const VaultsGridAlert = () => {
  const dispatch = useAppDispatch();
  const deletingVaultSuccessMessage = useAppSelector(selectDeletingVaultSuccessMessage);
  const editingVaultsErrorMessage = useAppSelector(selectEditingVaultsErrorMessage);
  const editingVaultsSuccessMessage = useAppSelector(selectEditingVaultsSuccessMessage);
  const isSavingChanges = useAppSelector(selectIsEditingVaults);

  const [showDeletedVaultSuccessAlert, setShowDeletedVaultSuccessAlert] = useState(!!deletingVaultSuccessMessage);
  const [showEditingErrorAlert, setShowEditingErrorAlert] = useState(!!editingVaultsErrorMessage);
  const [showSavingChangesAlert, setShowSavingChangesAlert] = useState(!!isSavingChanges);
  const [showEditingSuccessAlert, setShowEditingSuccessAlert] = useState(!!editingVaultsSuccessMessage);

  useEffect(() => {
    if (!!editingVaultsErrorMessage) {
      setShowEditingErrorAlert(true);
    }
  }, [editingVaultsErrorMessage]);

  useEffect(() => {
    setShowSavingChangesAlert(!!isSavingChanges);
  }, [isSavingChanges]);

  useEffect(() => {
    setShowDeletedVaultSuccessAlert(!!deletingVaultSuccessMessage);
    const timer = setTimeout(() => {
      setShowDeletedVaultSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [deletingVaultSuccessMessage]);

  useEffect(() => {
    setShowEditingSuccessAlert(!!editingVaultsSuccessMessage);
    const timer = setTimeout(() => {
      setShowEditingSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [dispatch, editingVaultsSuccessMessage]);

  return (
    <AlertDiv>
      <Alert
        dismissible
        onClose={() => setShowDeletedVaultSuccessAlert(false)}
        show={showEditingSuccessAlert || showSavingChangesAlert}
        variant="info"
      >
        {showEditingSuccessAlert ? editingVaultsSuccessMessage : showSavingChangesAlert && 'Saving vault changes...'}
      </Alert>
      <Alert dismissible onClose={() => setShowEditingErrorAlert(false)} show={showEditingErrorAlert} variant="danger">
        {editingVaultsErrorMessage}
      </Alert>
      <Alert
        dismissible
        onClose={() => setShowDeletedVaultSuccessAlert(false)}
        show={showDeletedVaultSuccessAlert}
        variant="info"
      >
        {deletingVaultSuccessMessage}
      </Alert>
    </AlertDiv>
  );
};

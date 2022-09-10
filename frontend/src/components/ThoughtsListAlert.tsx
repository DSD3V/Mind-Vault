import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import { CLEAR_EDIT_THOUGHTS_MESSAGES } from '../actions/thoughtActions';
import {
  selectDeletingThoughtSuccessMessage,
  selectEditingThoughtsErrorMessage,
  selectEditingThoughtsSuccessMessage,
  selectIsEditingThoughts,
} from '../selectors/thoughtSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { AlertDiv } from '../styles/GlobalStyles';

export const ThoughtsListAlert = () => {
  const dispatch = useAppDispatch();
  const deletingThoughtSuccessMessage = useAppSelector(selectDeletingThoughtSuccessMessage);
  const editingThoughtsErrorMessage = useAppSelector(selectEditingThoughtsErrorMessage);
  const editingThoughtsSuccessMessage = useAppSelector(selectEditingThoughtsSuccessMessage);
  const isSavingChanges = useAppSelector(selectIsEditingThoughts);

  const [showDeletedThoughtSuccessAlert, setShowDeletedThoughtSuccessAlert] = useState(!!deletingThoughtSuccessMessage);
  const [showEditingErrorAlert, setShowEditingErrorAlert] = useState(!!editingThoughtsErrorMessage);
  const [showSavingChangesAlert, setShowSavingChangesAlert] = useState(!!isSavingChanges);
  const [showEditingSuccessAlert, setShowEditingSuccessAlert] = useState(!!editingThoughtsSuccessMessage);

  useEffect(() => {
    if (!!editingThoughtsErrorMessage) {
      setShowEditingErrorAlert(true);
    }
  }, [editingThoughtsErrorMessage]);

  useEffect(() => {
    setShowSavingChangesAlert(!!isSavingChanges);
  }, [isSavingChanges]);

  useEffect(() => {
    setShowDeletedThoughtSuccessAlert(!!deletingThoughtSuccessMessage);
    const timer = setTimeout(() => {
      setShowDeletedThoughtSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [deletingThoughtSuccessMessage]);

  useEffect(() => {
    setShowEditingSuccessAlert(!!editingThoughtsSuccessMessage);
    const timer = setTimeout(() => {
      setShowEditingSuccessAlert(false);
      dispatch(CLEAR_EDIT_THOUGHTS_MESSAGES());
    }, 1800);
    return () => clearTimeout(timer);
  }, [dispatch, editingThoughtsSuccessMessage]);

  return (
    <AlertDiv>
      <Alert
        dismissible
        onClose={() => setShowDeletedThoughtSuccessAlert(false)}
        show={showEditingSuccessAlert || showSavingChangesAlert}
        variant="info"
      >
        {showEditingSuccessAlert
          ? editingThoughtsSuccessMessage
          : showSavingChangesAlert && 'Saving thought changes...'}
      </Alert>
      <Alert dismissible onClose={() => setShowEditingErrorAlert(false)} show={showEditingErrorAlert} variant="danger">
        {editingThoughtsErrorMessage}
      </Alert>
      <Alert
        dismissible
        onClose={() => setShowDeletedThoughtSuccessAlert(false)}
        show={showDeletedThoughtSuccessAlert}
        variant="info"
      >
        {deletingThoughtSuccessMessage}
      </Alert>
    </AlertDiv>
  );
};

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { addThought, CLEAR_ADD_THOUGHT_MESSAGES } from '../actions/thoughtActions';
import { ThoughtI } from '../interfaces';
import { RichTextEditor } from './RichTextEditor';
import {
  selectAddingThoughtErrorMessage,
  selectAddingThoughtSuccessMessage,
  selectDeletingThoughtSuccessMessage,
  selectIsAddingThought,
} from '../selectors/thoughtSelectors';
import { selectUserId } from '../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { ErrorMessage2, SuccessMessage2 } from '../styles/FormStyles';
import { Button, Div, EmptySpan } from '../styles/GlobalStyles';
import { ThoughtDiv } from '../styles/VaultStyles';

export const NewThoughtForm = ({
  newThoughtIndex,
  setIsFirstEditorInitialized,
  setThoughtIdToNewHTML,
  setThoughts,
  thoughtIdToNewHTML,
  vaultId,
}: {
  newThoughtIndex: number;
  setIsFirstEditorInitialized: Dispatch<SetStateAction<boolean>>;
  setThoughtIdToNewHTML: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setThoughts: Dispatch<SetStateAction<ThoughtI[]>>;
  thoughtIdToNewHTML: { [key: string]: string };
  vaultId: string;
}) => {
  const dispatch = useAppDispatch();
  const addingThoughtErrorMessage = useAppSelector(selectAddingThoughtErrorMessage);
  const addingThoughtSuccessMessage = useAppSelector(selectAddingThoughtSuccessMessage);
  const deletingThoughtSuccessMessage = useAppSelector(selectDeletingThoughtSuccessMessage);
  const isAddingThought = useAppSelector(selectIsAddingThought);
  const userId = useAppSelector(selectUserId);

  const [isNewThoughtEditorInitialized, setIsNewThoughtEditorInitialized] = useState(false);
  const [newThoughtHTML, setNewThoughtHTML] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  const isAddNewThoughtDisabled = isAddingThought || !newThoughtHTML;

  useEffect(() => {
    if (!!addingThoughtSuccessMessage) {
      setEditorKey((prevEditorKey: number) => prevEditorKey + 1);
    }
  }, [addingThoughtSuccessMessage]);

  useEffect(() => {
    if (!!deletingThoughtSuccessMessage) {
      dispatch(CLEAR_ADD_THOUGHT_MESSAGES());
    }
  }, [deletingThoughtSuccessMessage, dispatch]);

  const handleAddNewThoughtClicked = () =>
    dispatch(
      addThought({
        newThoughtHTML,
        orderIndex: newThoughtIndex,
        setThoughtIdToNewHTML,
        setThoughts,
        thoughtIdToNewHTML,
        userId,
        vaultId,
      })
    );

  const handleChange = ({ newHTML }: { newHTML: string }) => {
    setNewThoughtHTML(newHTML);
    if (!!addingThoughtErrorMessage || !!addingThoughtSuccessMessage) {
      dispatch(CLEAR_ADD_THOUGHT_MESSAGES());
    }
  };

  return (
    <ThoughtDiv $isInitialized={isNewThoughtEditorInitialized}>
      <RichTextEditor
        editorKey={editorKey}
        initialValue=""
        isForNewThought={true}
        onNewThoughtChange={handleChange}
        setIsFirstEditorInitialized={setIsFirstEditorInitialized}
        setIsNewThoughtEditorInitialized={setIsNewThoughtEditorInitialized}
        setThoughts={setThoughts}
        thoughtId=""
        thoughtIdToNewHTML={thoughtIdToNewHTML}
      />
      {isNewThoughtEditorInitialized && (
        <Div $d="column">
          <Div $m="8px 0 0 0">
            <Button
              $isDisabled={isAddNewThoughtDisabled}
              onClick={isAddNewThoughtDisabled ? () => {} : handleAddNewThoughtClicked}
            >
              {isAddingThought ? 'Adding Thought...' : 'Add Thought'}
            </Button>
          </Div>
          {addingThoughtErrorMessage && !addingThoughtSuccessMessage ? (
            <ErrorMessage2>{addingThoughtErrorMessage}</ErrorMessage2>
          ) : addingThoughtSuccessMessage && !addingThoughtErrorMessage ? (
            <SuccessMessage2>{addingThoughtSuccessMessage}</SuccessMessage2>
          ) : (
            <SuccessMessage2>
              <EmptySpan>&nbsp;</EmptySpan>
            </SuccessMessage2>
          )}
        </Div>
      )}
    </ThoughtDiv>
  );
};

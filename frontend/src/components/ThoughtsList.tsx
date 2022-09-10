import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

import { ThoughtI } from '../interfaces';
import { NewThoughtForm } from './NewThoughtForm';
import { RichTextEditor } from './RichTextEditor';
import { Div } from '../styles/GlobalStyles';
import { ThoughtDiv, ThoughtsListContainer } from '../styles/VaultStyles';
import { Thought } from './Thought';
import { ThoughtsListAlert } from './ThoughtsListAlert';

export const ThoughtsList = ({
  hasEditedThoughts,
  isEditingThoughts,
  setHasEditedThoughts,
  setThoughtEditErrors,
  setThoughtIdToNewHTML,
  setThoughts,
  thoughtIdToNewHTML,
  thoughts,
  vaultId,
}: {
  hasEditedThoughts: boolean;
  isEditingThoughts: boolean;
  setHasEditedThoughts: Dispatch<SetStateAction<boolean>>;
  setThoughtEditErrors: Dispatch<SetStateAction<Set<string>>>;
  setThoughtIdToNewHTML: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setThoughts: Dispatch<SetStateAction<ThoughtI[]>>;
  thoughtIdToNewHTML: { [key: string]: string };
  thoughts: ThoughtI[];
  vaultId: string;
}) => {
  const [isFirstEditorInitialized, setIsFirstEditorInitialized] = useState(false);
  const [sortableItems, setSortableItems] = useState(thoughts.map((thought) => thought.thoughtId));
  const [activeId, setActiveId] = useState(null);
  const [editorKeys, setEditorKeys] = useState(thoughts.map((_, idx) => idx));
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setSortableItems(thoughts.map((thought) => thought.thoughtId));
    if (thoughts.length > editorKeys.length) {
      editorKeys.push(!editorKeys.length ? 0 : editorKeys[editorKeys.length - 1] + 1);
    }
  }, [editorKeys, thoughts]);

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!!active && !!over && active.id !== over.id) {
      const newIndex = sortableItems.indexOf(over.id);
      const oldIndex = sortableItems.indexOf(active.id);
      if (!hasEditedThoughts) {
        setHasEditedThoughts(true);
      }
      setThoughts((prevThoughts) => arrayMove(prevThoughts, oldIndex, newIndex));
    }
    setEditorKeys((prevEditorKeys) => prevEditorKeys.map((editorKey) => editorKey + 1));
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setThoughts!((prevThoughts) =>
      prevThoughts.map((thought) => ({
        ...thought,
        html: thoughtIdToNewHTML[thought.thoughtId],
      }))
    );
    setActiveId(active.id);
  };

  return (
    <ThoughtsListContainer>
      <ThoughtsListAlert />
      {!!thoughts.length && !isFirstEditorInitialized && (
        <Div $d="column" $f="1.1rem">
          <span style={{ paddingBottom: '15px' }}>Loading thoughts...</span>
          <TailSpin color="#00BFFF" height={50} width={50} />
        </Div>
      )}
      {isEditingThoughts && ((!!thoughts.length && isFirstEditorInitialized) || !thoughts.length) ? (
        <>
          <NewThoughtForm
            newThoughtIndex={thoughts.length}
            setIsFirstEditorInitialized={setIsFirstEditorInitialized}
            setThoughtIdToNewHTML={setThoughtIdToNewHTML}
            setThoughts={setThoughts}
            thoughtIdToNewHTML={thoughtIdToNewHTML}
            vaultId={vaultId}
          />
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
            <SortableContext items={sortableItems}>
              {thoughts.map((thought, idx) => (
                <ThoughtDiv $isInitialized={isFirstEditorInitialized} key={thought.thoughtId}>
                  <RichTextEditor
                    editorKey={editorKeys[idx]}
                    handle={true}
                    hasEditedThoughts={hasEditedThoughts}
                    initialValue={thought.html}
                    isActive={activeId === thought.thoughtId}
                    setHasEditedThoughts={setHasEditedThoughts}
                    setIsFirstEditorInitialized={setIsFirstEditorInitialized}
                    setThoughtEditErrors={setThoughtEditErrors}
                    setThoughtIdToNewHTML={setThoughtIdToNewHTML}
                    setThoughts={setThoughts}
                    thoughtId={thought.thoughtId}
                    thoughtIdToNewHTML={thoughtIdToNewHTML}
                  />
                </ThoughtDiv>
              ))}
              <DragOverlay>
                {!!activeId ? (
                  <RichTextEditor
                    handle={true}
                    id={activeId}
                    initialValue={thoughts.find((thought) => thought.thoughtId === activeId)!.html}
                    setIsFirstEditorInitialized={setIsFirstEditorInitialized}
                    setThoughtEditErrors={setThoughtEditErrors}
                    setThoughts={setThoughts}
                    thoughtId={activeId!}
                  />
                ) : null}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <>
          {thoughts.map((thought) => (
            <Thought
              html={thought.html}
              isFirstEditorInitialized={isFirstEditorInitialized}
              key={thought.thoughtId}
              setIsFirstEditorInitialized={setIsFirstEditorInitialized}
            />
          ))}
        </>
      )}
    </ThoughtsListContainer>
  );
};

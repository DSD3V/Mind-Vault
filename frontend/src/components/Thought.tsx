import { Dispatch, SetStateAction } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { RTE_CONTENT_STYLE, RTE_HEIGHT } from '../constants';
import '../styles/richTextEditorSkin.css';
import { ThoughtDiv } from '../styles/VaultStyles';

export const Thought = ({
  html,
  isFirstEditorInitialized,
  setIsFirstEditorInitialized,
}: {
  html: string;
  isFirstEditorInitialized: boolean;
  setIsFirstEditorInitialized: Dispatch<SetStateAction<boolean>>;
}) => (
  <ThoughtDiv $isInitialized={isFirstEditorInitialized}>
    <Editor
      disabled={true}
      init={{
        content_style: RTE_CONTENT_STYLE,
        contextmenu: false,
        height: RTE_HEIGHT,
        menubar: false,
        statusbar: false,
        toolbar: false,
        width: '100%',
      }}
      initialValue={html}
      onInit={() => setIsFirstEditorInitialized(true)}
    />
  </ThoughtDiv>
);

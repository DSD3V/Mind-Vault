import { Editor } from '@tinymce/tinymce-react';
import { SetStateAction } from 'react';

import '../styles/richTextEditorSkin.css';
import { RTE_HEIGHT } from '../constants';
import { ThoughtDiv } from '../styles/VaultStyles';

export const Thought = ({
  html,
  isFirstEditorInitialized,
  setIsFirstEditorInitialized,
}: {
  html: string;
  isFirstEditorInitialized: boolean;
  setIsFirstEditorInitialized: React.Dispatch<SetStateAction<boolean>>;
}) => (
  <ThoughtDiv $isInitialized={isFirstEditorInitialized}>
    <Editor
      disabled={true}
      init={{
        content_css: `${process.env.PUBLIC_URL}/richTextEditor.css`,
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

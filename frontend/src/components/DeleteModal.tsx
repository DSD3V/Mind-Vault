import { Button, Modal } from 'react-bootstrap';

import { colors } from '../constants';
import { Div } from '../styles/GlobalStyles';

export const DeleteModal = ({
  bodyText,
  deleteText,
  errorMessage,
  onClose,
  onDelete,
  shouldShow,
  title,
}: {
  bodyText: string;
  deleteText: string;
  errorMessage: string;
  onClose: () => void;
  onDelete: () => void;
  shouldShow: boolean;
  title: string;
}) => (
  <Modal backdrop='static' centered onHide={onClose} show={shouldShow}>
    <Modal.Header closeButton>
      <Modal.Title>
        Deleting {title.length > 20 ? title.slice(0, 20) + '...' : title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {bodyText}
      <Div $c={colors.RED} $m='10px 0 0 0'>
        {!!errorMessage && errorMessage}
      </Div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onClose} variant='secondary'>
        Cancel
      </Button>
      <Button onClick={onDelete} variant='danger'>
        {deleteText}
      </Button>
    </Modal.Footer>
  </Modal>
);

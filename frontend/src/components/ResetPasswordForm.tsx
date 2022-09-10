import { useLayoutEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { CLEAR_FORM, resetPassword } from '../actions/userActions';
import { REQUIRED_ERROR_MESSAGE, VALID_EMAIL_FORM_ERROR_MESSAGE, VALID_EMAIL_REGEX } from '../constants';
import { selectUserErrorMessage, selectUserIsLoading, selectUserSuccessMessage } from '../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { ResetPasswordErrorMessage, SubmitButtonDiv, SuccessMessage } from '../styles/FormStyles';
import { StyledLink } from '../styles/GlobalStyles';

const defaultFormValues = {
  email: '',
} as {
  email: string;
};

export const ResetPasswordForm = ({ setSelectedForm }: { setSelectedForm: (form: string) => void }) => {
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const dispatch = useAppDispatch();
  const resetPasswordErrorMessage = useAppSelector(selectUserErrorMessage);
  const resetPasswordSuccessMessage = useAppSelector(selectUserSuccessMessage);
  const isResetPasswordLoading = useAppSelector(selectUserIsLoading);

  useLayoutEffect(() => {
    dispatch(CLEAR_FORM());
  }, [dispatch]);

  const handleResetClicked = handleSubmit(async ({ email }) => dispatch(resetPassword({ email })));

  return (
    <Card>
      <Card.Body>
        <h2 className="mb-4 text-center">Password Reset</h2>
        <Form noValidate onSubmit={handleResetClicked}>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Email *</b>
            </Form.Label>
            <Form.Control
              {...register('email', {
                pattern: {
                  message: VALID_EMAIL_FORM_ERROR_MESSAGE,
                  value: VALID_EMAIL_REGEX,
                },
                required: {
                  message: REQUIRED_ERROR_MESSAGE,
                  value: true,
                },
              })}
              placeholder="Enter email"
              type="email"
            />
            <ResetPasswordErrorMessage>{errors.email && errors.email.message}</ResetPasswordErrorMessage>
          </Form.Group>
          <SubmitButtonDiv>
            <Button
              className="mb-2"
              disabled={
                isResetPasswordLoading ||
                !!Object.keys(errors).length ||
                Object.keys(dirtyFields).length < Object.keys(defaultFormValues).length
              }
              type="submit"
            >
              Reset Password
            </Button>
            {isResetPasswordLoading && <p>Sending reset password email...</p>}
            {!!resetPasswordSuccessMessage && <SuccessMessage>{resetPasswordSuccessMessage}</SuccessMessage>}
            {!!resetPasswordErrorMessage && (
              <ResetPasswordErrorMessage>{resetPasswordErrorMessage}</ResetPasswordErrorMessage>
            )}
          </SubmitButtonDiv>
          <div className="text-center mt-3">
            <StyledLink onClick={() => setSelectedForm('login')}>Return to Log In</StyledLink>
          </div>
        </Form>
      </Card.Body>
      <div className="mb-3 mt-1 text-center">
        Need an account? <StyledLink onClick={() => setSelectedForm('signup')}>Sign Up</StyledLink>
      </div>
    </Card>
  );
};

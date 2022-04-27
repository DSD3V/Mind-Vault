import { useLayoutEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { CLEAR_FORM, logIn, logInWithGoogle } from '../actions/userActions';
import { GoogleButton } from './GoogleButton';
import {
  selectUserErrorMessage,
  selectUserIsLoading,
} from '../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import {
  ErrorMessage,
  GoogleButtonDiv,
  SubmitButtonDiv,
} from '../styles/FormStyles';
import { StyledLink } from '../styles/GlobalStyles';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  VALID_EMAIL_FORM_ERROR_MESSAGE,
  VALID_EMAIL_REGEX,
} from '../constants';

const defaultFormValues = {
  email: '',
  password: '',
};

export const LoginForm = ({
  setSelectedForm,
}: {
  setSelectedForm: (form: string) => void;
}) => {
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const dispatch = useAppDispatch();
  const loginErrorMessage = useAppSelector(selectUserErrorMessage);
  const isLoginLoading = useAppSelector(selectUserIsLoading);

  useLayoutEffect(() => {
    dispatch(CLEAR_FORM());
  }, [dispatch]);

  const handleLogInClicked = handleSubmit(
    async ({ email, password }: { email: string; password: string }) =>
      dispatch(logIn({ email, password }))
  );

  const handleLogInWithGoogleClicked = () => dispatch(logInWithGoogle());

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={handleLogInClicked}>
          <Form.Group className='mb-3'>
            <Form.Label className='mb-1'>
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
              placeholder='Enter email'
              type='email'
            />
            <ErrorMessage>{errors.email && errors.email.message}</ErrorMessage>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label className='mb-1'>
              <b>Password *</b>
            </Form.Label>
            <Form.Control
              {...register('password', {
                minLength: {
                  message: PASSWORD_MIN_LENGTH_ERROR_MESSAGE,
                  value: PASSWORD_MIN_LENGTH,
                },
                required: {
                  message: REQUIRED_ERROR_MESSAGE,
                  value: true,
                },
              })}
              placeholder='Enter password'
              type='password'
            />
            <ErrorMessage>
              {errors.password && errors.password.message}
            </ErrorMessage>
          </Form.Group>
          <SubmitButtonDiv>
            <Button
              className='mb-2'
              disabled={
                isLoginLoading ||
                !!Object.keys(errors).length ||
                Object.keys(dirtyFields).length <
                  Object.keys(defaultFormValues).length
              }
              type='submit'
            >
              Log In
            </Button>
            {isLoginLoading && <p>Logging in...</p>}
            {!!loginErrorMessage && (
              <ErrorMessage>{loginErrorMessage}</ErrorMessage>
            )}
          </SubmitButtonDiv>
          <div className='mt-3 text-center'>
            <StyledLink onClick={() => setSelectedForm('resetPassword')}>
              Forgot Password?
            </StyledLink>
          </div>
        </Form>
      </Card.Body>
      <div className='mb-3 mt-2 text-center'>
        Need an account?{' '}
        <StyledLink onClick={() => setSelectedForm('signup')}>
          Sign Up
        </StyledLink>
      </div>
      <GoogleButtonDiv>
        <GoogleButton onClick={handleLogInWithGoogleClicked} />
      </GoogleButtonDiv>
    </Card>
  );
};

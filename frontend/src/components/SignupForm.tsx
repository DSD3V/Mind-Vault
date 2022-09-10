import { useEffect, useLayoutEffect, useRef } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import ReCaptchaV2 from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';

import { CLEAR_FORM, logInWithGoogle, signUp } from '../actions/userActions';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR_MESSAGE,
  PASSWORDS_MUST_MATCH_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  VALID_EMAIL_FORM_ERROR_MESSAGE,
  VALID_EMAIL_REGEX,
} from '../constants';
import { GoogleButton } from './GoogleButton';
import { selectUserErrorMessage, selectUserIsSignUpLoading } from '../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { CaptchaDiv, ErrorMessage, GoogleButtonDiv, SubmitButtonDiv } from '../styles/FormStyles';
import { StyledLink } from '../styles/GlobalStyles';

const defaultFormValues = {
  confirmPassword: '',
  email: '',
  'g-recaptcha-response': '',
  password: '',
};

export const SignupForm = ({ setSelectedForm }: { setSelectedForm: (form: string) => void }) => {
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
  });
  const reCaptchaRef = useRef<ReCaptchaV2>(null);
  const dispatch = useAppDispatch();
  const signUpErrorMessage = useAppSelector(selectUserErrorMessage);
  const isSignUpLoading = useAppSelector(selectUserIsSignUpLoading);

  useEffect(() => {
    register('g-recaptcha-response', {
      required: {
        message: REQUIRED_ERROR_MESSAGE,
        value: true,
      },
    });
  }, [register]);

  useLayoutEffect(() => {
    dispatch(CLEAR_FORM());
  }, [dispatch]);

  const handleSignUpClicked = handleSubmit(async ({ email, password }) => dispatch(signUp({ email, password })));

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={handleSignUpClicked}>
          <Form.Group className="mb-3">
            <Form.Label className="mb-1">
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
            <ErrorMessage>{errors.email && errors.email.message}</ErrorMessage>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mb-1">
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
              placeholder="Enter password"
              type="password"
            />
            <ErrorMessage>{errors.password && errors.password.message}</ErrorMessage>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mb-1">
              <b>Confirm Password *</b>
            </Form.Label>
            <Form.Control
              {...register('confirmPassword', {
                minLength: {
                  message: PASSWORD_MIN_LENGTH_ERROR_MESSAGE,
                  value: PASSWORD_MIN_LENGTH,
                },
                required: {
                  message: REQUIRED_ERROR_MESSAGE,
                  value: true,
                },
                validate: (value: string) => value === watch('password') || PASSWORDS_MUST_MATCH_ERROR_MESSAGE,
              })}
              placeholder="Confirm pasword"
              type="password"
            />
            <ErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</ErrorMessage>
          </Form.Group>
          <CaptchaDiv>
            <ReCaptchaV2
              onChange={(captchaValue) => setValue('g-recaptcha-response', captchaValue || '')}
              onExpired={() => setValue('g-recaptcha-response', '')}
              ref={reCaptchaRef}
              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY || ''}
            />
            <ErrorMessage>{errors['g-recaptcha-response'] && errors['g-recaptcha-response'].message}</ErrorMessage>
          </CaptchaDiv>
          <SubmitButtonDiv>
            <Button
              className="mb-2"
              disabled={
                isSignUpLoading ||
                !!Object.keys(errors).length ||
                Object.keys(dirtyFields).length < --Object.keys(defaultFormValues).length ||
                !watch('g-recaptcha-response')
              }
              type="submit"
            >
              Sign Up
            </Button>
            {isSignUpLoading && <p>Signing up...</p>}
            {!!signUpErrorMessage && <ErrorMessage>{signUpErrorMessage}</ErrorMessage>}
          </SubmitButtonDiv>
        </Form>
      </Card.Body>
      <div className="mb-3 mt-2 text-center">
        Already have an account? <StyledLink onClick={() => setSelectedForm('login')}>Log In</StyledLink>
      </div>
      <GoogleButtonDiv>
        <GoogleButton onClick={() => dispatch(logInWithGoogle())} />
      </GoogleButtonDiv>
    </Card>
  );
};

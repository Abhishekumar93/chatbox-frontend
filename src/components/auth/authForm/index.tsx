/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/molecules/inputField';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { ROUTE_URLS } from '@/constants/routeUrls';
import { FormType } from '@/interfaceAndTypes/form';
import {
  clearLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/utils/localStorage';
import { getApi, postApi } from '@/utils/restApi';
import { useRouter } from 'next/navigation';
import {
  FC,
  FormEvent,
  memo,
  startTransition,
  useActionState,
  useEffect,
} from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface IAuthForm {
  formTitle: string;
  submitBtnLabel?: string;
  btnLabel?: string;
  redirectUrl?: string;
  formType?: FormType;
}

interface IFormErrorOrValue {
  email: string | undefined;
  password: string | undefined;
  username?: string;
  name?: string;
}
interface IFormState {
  error: IFormErrorOrValue;
  values: IFormErrorOrValue;
  apiSuccess: boolean;
}

const errorInitialState: IFormErrorOrValue = {
  email: undefined,
  password: undefined,
  username: undefined,
  name: undefined,
};
const valuesInitialState: IFormErrorOrValue = {
  email: '',
  password: '',
  username: '',
  name: '',
};
const initialState: IFormState = {
  error: errorInitialState,
  values: valuesInitialState,
  apiSuccess: false,
};

const { LOGGED_IN_USER_DATA } = LOCAL_STORAGE_KEY;

const handleFormSubmit = async (prevState: IFormState, formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const formType = formData.get('formType') as FormType;

  const fieldError: IFormErrorOrValue = { ...errorInitialState };
  if (formType === 'register') {
    if (!username) fieldError.username = 'Username is required';
    if (!name) fieldError.name = 'Name is required';
  }
  if (!email) fieldError.email = 'Email is required!';
  if (!password) fieldError.password = 'Password is required!';
  if (
    !email ||
    !password ||
    (formType === 'register' && (!username || !name))
  ) {
    return { error: fieldError, values: prevState.values, apiSuccess: false };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldError.email = 'Email is not valid';
    return {
      error: fieldError,
      values: prevState.values,
      apiSuccess: false,
    };
  }

  formData.delete('formType');
  formData.set('password', btoa(password));
  try {
    await postApi(`/auth/${formType}`, formData);
    toast.success(
      `User ${
        formType === 'register' ? 'registered' : 'logged in'
      } succesfully!`,
    );
    initialState.apiSuccess = true;
  } catch (error: any) {
    toast.error(error?.message);
    initialState.apiSuccess = false;
  } finally {
    return initialState;
  }
};

const { LOGIN, MESSAGES } = ROUTE_URLS;

const AuthForm: FC<IAuthForm> = ({
  submitBtnLabel,
  btnLabel,
  redirectUrl,
  formTitle,
  formType = 'login',
}) => {
  const router = useRouter();

  const [state, formSubmitAction, isPending] = useActionState(
    handleFormSubmit,
    initialState,
  );

  useEffect(() => {
    clearLocalStorage();
  }, []);
  useEffect(() => {
    if (isPending || !state.apiSuccess) return;
    if (formType === 'login') {
      getApi('/users/currentUser')
        .then((response) => {
          setLocalStorage(LOGGED_IN_USER_DATA, response.data);
        })
        .catch((error) => {
          removeLocalStorage(LOGGED_IN_USER_DATA);
        });
    }
    location.href = formType === 'register' ? LOGIN : MESSAGES;
  }, [isPending]);

  const onClick = () => {
    if (!(redirectUrl || redirectUrl?.trim())) return;
    router.push(redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData: FormData = new FormData(event.currentTarget);
    startTransition(() => formSubmitAction(formData));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div style={{ maxWidth: '20rem' }}>
        <h1 className="text-center mb-5">{formTitle}</h1>
        <Form onSubmit={handleSubmit}>
          <Row>
            {formType === 'register' && (
              <>
                <InputField
                  name="username"
                  placeholder="Enter your username"
                  label="Username"
                  icon="@"
                  additionalInfoText="Username should be unique without whitespace."
                  error={state.error.username}
                  defaultValue={state.values.username}
                  autoComplete="username"
                />
                <InputField
                  name="name"
                  placeholder="Enter your name"
                  label="Name"
                  error={state.error.name}
                  defaultValue={state.values.name}
                  autoComplete="name"
                />
              </>
            )}
            <InputField
              name="email"
              placeholder="Enter your email"
              label="Email"
              error={state.error.email}
              defaultValue={state.values.email}
              autoComplete="email"
            />
            <InputField
              name="password"
              type="password"
              placeholder="Enter your password"
              label="Password"
              error={state.error.password}
              defaultValue={state.values.password}
              autoComplete="off"
            />
            <InputField name="formType" defaultValue={formType} hidden={true} />
          </Row>
          <div className="d-flex align-items-center justify-content-between mt-3 font-14">
            {submitBtnLabel?.trim() && (
              <Button type="submit" disabled={isPending}>
                {submitBtnLabel}
              </Button>
            )}
            {btnLabel?.trim() && redirectUrl?.trim() && (
              <Button onClick={onClick}>{btnLabel}</Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default memo(AuthForm);

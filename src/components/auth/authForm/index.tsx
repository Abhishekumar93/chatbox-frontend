'use client';

import InputField from '@/components/molecules/inputField';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { ROUTE_URLS } from '@/constants/routeUrls';
import { FormType } from '@/interfaceAndTypes/form';
import { clearLocalStorage, setLocalStorage } from '@/utils/localStorage';
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

interface IFormError {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
}

interface IFormState {
  error: IFormError;
  apiSuccess: boolean;
}

const initialState: IFormState = {
  error: {},
  apiSuccess: false,
};

const handleFormSubmit = async (
  prevState: IFormState,
  formData: FormData,
): Promise<IFormState> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const formType = formData.get('formType') as FormType;

  const error: IFormError = {};

  if (!email) error.email = 'Email is required';
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  error.email = 'Email is not valid';

  if (!password) error.password = 'Password is required';

  if (formType === 'register') {
    if (!username) error.username = 'Username is required';
    if (!name) error.name = 'Name is required';
  }

  if (Object.keys(error).length > 0) {
    return { ...prevState, error };
  }

  const payload = {
  email,
  password: btoa(password),
  ...(formType === 'register' && { username, name }),
};

  try {
    const response = await postApi(`/auth/${formType}`, payload);

    if (response.status === 200) {
      toast.success(
        `User ${formType === 'register' ? 'registered' : 'logged in'} successfully`,
      );
      return { error: {}, apiSuccess: true };
    }

    toast.error('Something went wrong');
    return { ...prevState, apiSuccess: false };
  } catch (err: any) {
    toast.error(err?.message);
    return { ...prevState, apiSuccess: false };
  }
};

const { LOGIN, MESSAGES } = ROUTE_URLS;
const { LOGGED_IN_USER_DATA } = LOCAL_STORAGE_KEY;

const AuthForm: FC<any> = ({
  submitBtnLabel,
  btnLabel,
  redirectUrl,
  formTitle,
  formType = 'login',
}) => {
  const router = useRouter();

  const [state, submitAction, isPending] = useActionState(
    handleFormSubmit,
    initialState,
  );

  useEffect(() => {
    if (!state.apiSuccess) return;

    if (formType === 'login') {
      getApi('/users/currentUser')
        .then((res) =>
          setLocalStorage(LOGGED_IN_USER_DATA, res.data?.data),
        )
        .catch(clearLocalStorage);
    }

    router.replace(formType === 'register' ? LOGIN : MESSAGES);
  }, [state.apiSuccess, formType, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => submitAction(formData));
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
                  label="Username"
                  error={state.error.username}
                />
                <InputField
                  name="name"
                  label="Name"
                  error={state.error.name}
                />
              </>
            )}

            <InputField
              name="email"
              label="Email"
              error={state.error.email}
            />

            <InputField
              name="password"
              type="password"
              label="Password"
              error={state.error.password}
            />

            <InputField name="formType" defaultValue={formType} hidden />
          </Row>

          <div className="d-flex justify-content-between mt-3">
            {submitBtnLabel && (
              <Button type="submit" disabled={isPending}>
                {submitBtnLabel}
              </Button>
            )}
            {btnLabel && redirectUrl && (
              <Button onClick={() => router.push(redirectUrl)}>
                {btnLabel}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default memo(AuthForm);

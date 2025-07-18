'use client';

import AuthForm from '../authForm';

const LoginForm = () => {
  return (
    <AuthForm
      formTitle="Login"
      submitBtnLabel="Login"
      btnLabel="Register"
      redirectUrl="/register"
    />
  );
};

export default LoginForm;

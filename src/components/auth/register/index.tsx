'use client';

import AuthForm from '../authForm';

const RegisterForm = () => {
  return (
    <AuthForm
      formTitle="Register"
      submitBtnLabel="Register"
      btnLabel="Login"
      redirectUrl="/login"
      formType="register"
    />
  );
};

export default RegisterForm;

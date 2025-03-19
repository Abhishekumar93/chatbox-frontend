'use client';

import { Form } from 'react-bootstrap';
import InputField from '../molecules/inputField';

const LoginForm = () => {
  return (
    <div>
      <Form>
        <InputField name="email" placeholder="Enter your email" label="Email" />
      </Form>
      <h1>Sign up for an account</h1>
      <h2>Already have an account? Login</h2>
    </div>
  );
};

export default LoginForm;

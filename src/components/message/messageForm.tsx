'use client';

import { Button, Form } from 'react-bootstrap';
import InputField from '../molecules/inputField';
import Style from './messageForm.module.css';

const MessageForm = () => {
  return (
    <Form className={`${Style['message-form']}`}>
      <InputField
        name="message_box"
        placeholder="Type message..."
        formGroupClassName="mb-0 w-100"
      />
      <Button
        type="submit"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          // Handle message submission logic here
        }}
      >
        Send
      </Button>
    </Form>
  );
};

export default MessageForm;

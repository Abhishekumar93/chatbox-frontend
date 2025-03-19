import { FC, memo, ReactNode } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface IInputField {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  name: string;
  error?: string;
  disabled?: boolean;
}

const InputField: FC<IInputField> = ({
  label,
  onChange,
  placeholder,
  type,
  value,
  icon,
  name,
  error,
  disabled,
}) => {
  console.log('InputField', name);

  return (
    <Form.Group className="mb-3" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <InputGroup>
        {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
        <Form.Control
          id={name}
          name={name}
          type={type ?? 'text'}
          placeholder={placeholder ?? name}
          value={value}
          onChange={onChange}
          isInvalid={!!error}
          disabled={disabled}
        />
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default memo(InputField);

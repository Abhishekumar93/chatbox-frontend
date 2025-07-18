import { FC, HTMLInputAutoCompleteAttribute, memo, ReactNode } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface IInputField {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode | string;
  name: string;
  error?: string;
  disabled?: boolean;
  hidden?: boolean;
  additionalInfoText?: string;
  defaultValue?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  formGroupClassName?: string;
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
  hidden,
  additionalInfoText,
  defaultValue,
  autoComplete,
  formGroupClassName,
}) => {
  return (
    <Form.Group hidden={hidden} className={formGroupClassName ?? 'mb-3'}>
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
          className={!icon ? 'rounded' : 'rounded-end'}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
        />
        {additionalInfoText && (
          <Form.Text id={`${name}Text`} className="text-info">
            {additionalInfoText}
          </Form.Text>
        )}
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default memo(InputField);

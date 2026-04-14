import { authInputClassName, authLabelClassName } from "./authFieldClasses";

type AuthTextFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;
  labelExtra?: React.ReactNode;
};

export default function AuthTextField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  labelExtra,
}: AuthTextFieldProps) {
  return (
    <div>
      {labelExtra ? (
        <div className="flex items-center justify-between mb-2">
          <label htmlFor={id} className={authLabelClassName}>
            {label}
          </label>
          {labelExtra}
        </div>
      ) : (
        <label htmlFor={id} className={`block ${authLabelClassName} mb-2`}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={authInputClassName}
      />
    </div>
  );
}

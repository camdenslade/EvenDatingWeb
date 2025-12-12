import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './FormInput.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormInput({ label, error, required, ...props }: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        {...props}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <span id={`${props.id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export function FormTextarea({ label, error, required, ...props }: FormTextareaProps) {
  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <textarea
        {...props}
        className={`form-textarea ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <span id={`${props.id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}


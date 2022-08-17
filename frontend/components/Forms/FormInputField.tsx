

import { ErrorMessage, Field } from "formik";
import { InputHTMLAttributes } from "react";

export const FormInputField = ({
  fieldId,
  fieldLabel,
  placeholder,
  isInline,
  type = "text",
  ...props
}: {
  fieldId: string;
  placeholder?: string;
  isInline?: boolean;
  fieldLabel?: string;
  type?: string;
  
} & InputHTMLAttributes<any>) => (
  <label
    className={`input-group h-full w-full text-sm ${
      isInline ? "flex-row" : "flex-col"
    }`}
  >
    {fieldLabel && <div className="label w-full pb-1">{fieldLabel}</div>}
    <Field
      name={fieldId}
      type={type}
      id={fieldId}
      autoComplete="off"
      {...props}
      placeholder={placeholder}
      className="input input-bordered px-3 min-h-full border-black bg-slate-50 w-full"
    />
    <ErrorMessage className="text-red-500 text-xs mt-1" name={fieldId} />
  </label>
);

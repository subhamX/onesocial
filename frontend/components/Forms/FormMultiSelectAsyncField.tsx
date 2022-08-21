import { ErrorMessage, useFormikContext } from "formik";
import { ActionMeta } from "react-select";
import Select, { useAsync } from "react-select/async";

export const FormMultiSelectAsyncField = ({
  fieldId,
  fieldLabel,
  options,
  isInline,
  placeholder,
  applyWrapperStyles,
  loadOptions
}: {
  fieldId: string;
  fieldLabel: string;
  options: { value: string; label: string }[];
  isInline?: boolean;
  placeholder: string
  applyWrapperStyles?: boolean,
  loadOptions: (val: string) => Promise<{ label: string, value: string }[]>
}) => {
  const { setFieldValue, getFieldProps } = useFormikContext();
  const value = getFieldProps(fieldId).value;

  return (
    <>
      <FormMultiSelectFieldMain
        fieldId={fieldId}
        fieldLabel={fieldLabel}
        onChange={(options) => {
          setFieldValue(fieldId, options)
        }}
        options={options}
        value={value}
        isInline={isInline}
        loadOptions={loadOptions}
        placeholder={placeholder}
        applyWrapperStyles={applyWrapperStyles}
      />
      <ErrorMessage className="text-red-500 text-xs mt-1" name={fieldId} />
    </>
  );
};

export const FormMultiSelectFieldMain = ({
  fieldId,
  fieldLabel,
  options,
  isInline,
  onChange,
  value,
  placeholder,
  applyWrapperStyles,
  loadOptions
}: {
  fieldId: string;
  fieldLabel: string;
  options: { value: string; label: string }[];
  isInline?: boolean;
  placeholder?: string
  onChange:
  | ((
    newValue: { value: string; label: string }[],
    actionMeta: ActionMeta<any>
  ) => void)
  | undefined;
  value: { value: string; label: string }[],
  applyWrapperStyles?: boolean,
  loadOptions: (val: string) => Promise<{ label: string, value: string }[]>
}) => {
  return (
    <label
      className={`input-group w-full text-sm ${isInline ? "flex-row" : "flex-col"
        }`}
    >
      <div className="label w-full pb-1">{fieldLabel}</div>
      <Select
        components={{
          IndicatorSeparator: null,
        }}
        name={fieldId}
        loadOptions={loadOptions}
        onChange={onChange as any}
        isMulti={true}
        value={value}
        className={applyWrapperStyles ? "selectContainerWrapper" : ""}
        classNamePrefix="react-select"
        placeholder={placeholder}
      />
    </label>
  );
};

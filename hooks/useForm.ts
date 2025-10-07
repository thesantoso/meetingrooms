import { AlertConfig, FormErrors } from "@/types";
import { useState } from "react";

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    type: "success",
  });

  const setValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validate = (): boolean => {
    if (!validationRules) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const validator = validationRules[field as keyof T];
      if (validator) {
        const error = validator(values[field as keyof T]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const showSuccessAlert = (title: string, message: string) => {
    setAlertConfig({ title, message, type: "success" });
    setShowAlert(true);
  };

  const showErrorAlert = (title: string, message: string) => {
    setAlertConfig({ title, message, type: "error" });
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,
    setLoading,
    setValue,
    validate,
    reset,
    showAlert,
    alertConfig,
    showSuccessAlert,
    showErrorAlert,
    closeAlert,
  };
}

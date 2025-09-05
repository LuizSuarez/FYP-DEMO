import React, { createContext, useContext, forwardRef, useId } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, useFormContext, FormProvider, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Form Provider
export const Form = FormProvider;

// Form Field Context
const FormFieldContext = createContext({});
export const FormField = ({ ...props }) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

// Hook to use form field state
export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) throw new Error("useFormField must be inside <FormField>");

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Form Item Context
const FormItemContext = createContext({});
export const FormItem = forwardRef(({ className, ...props }, ref) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// Form Label
export const FormLabel = forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return <Label ref={ref} htmlFor={formItemId} className={cn(error && "text-destructive", className)} {...props} />;
});
FormLabel.displayName = "FormLabel";

// Form Control
export const FormControl = forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-invalid={!!error}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// Form Description
export const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
});
FormDescription.displayName = "FormDescription";

// Form Message
export const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;

  return (
    <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

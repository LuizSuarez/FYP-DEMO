import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export const Collapsible = ({ children, ...props }) => {
  return <CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>;
};

export const CollapsibleTrigger = ({ children, ...props }) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger {...props}>
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
};

export const CollapsibleContent = ({ children, ...props }) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent {...props}>
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
};

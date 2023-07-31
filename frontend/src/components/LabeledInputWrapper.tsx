import { FormControl, FormLabel } from "@mui/material";

type LabeledInputWrapperProps = {
  label?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

const muiStyles = {
  formLabel: {
    marginBottom: "5px",
  },
};

export default function LabeledInputWrapper({ label, htmlFor, children }: LabeledInputWrapperProps) {
  return (
    <FormControl>
      <FormLabel htmlFor={htmlFor} sx={muiStyles.formLabel}>
        {label}
      </FormLabel>
      {children}
    </FormControl>
  );
}
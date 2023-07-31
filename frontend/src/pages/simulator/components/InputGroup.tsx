import { Typography } from "@mui/material";

type InputGroupProps = {
  title: string;
  children: React.ReactNode;
};

export default function InputGroup({ title, children }: InputGroupProps) {
  return (
    <section>
      <Typography fontSize="1.125rem" marginBottom={1.5}>{title}</Typography>
      {children}
    </section>
  );
}
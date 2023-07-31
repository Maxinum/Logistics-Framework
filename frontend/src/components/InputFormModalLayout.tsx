import { Box, Stack, styled } from "@mui/material";
import ModalWrapper from "./ModalWrapper";

type InputFormModalLayoutProps = {
  title: string;
  isOpen: boolean;
  handleSubmit: React.FormEventHandler;
  handleToggle: () => void;
  closeOnClickAway?: boolean;
  children: React.ReactNode;
};

const styles = {
  modal: {
    width: "95%",
    maxWidth: "925px",
  },
};

export default function InputFormModalLayout({
  title,
  isOpen,
  handleSubmit,
  handleToggle,
  closeOnClickAway = true,
  children
}: InputFormModalLayoutProps) {
  return (
    <ModalWrapper
      title={title}
      isOpen={isOpen}
      style={styles.modal}
      handleToggle={handleToggle}
      closeOnClickAway={closeOnClickAway}
    >
      <Stack component="form" spacing="24px" onSubmit={handleSubmit}>
        {children}
      </Stack>
    </ModalWrapper>
  );
}

InputFormModalLayout.Section = styled(Box)`
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 24px;
` as typeof Box;
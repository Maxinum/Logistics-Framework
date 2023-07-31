import { useState } from "react";
import { useLocation, Outlet, NavLink } from "react-router-dom";
import { Box, Stack, Tabs, Tab, Typography } from "@mui/material";
import { Container, PrimaryButton, ModalWrapper } from "../../components";
import UserInvitationForm from "./components/UserInvitationForm";

const muiStyles = {
  header: {
    borderBottom: "1px solid #94a1ab",
    paddingBottom: "12px",
  },
  heading: {
    color: "var(--blue)",
    fontSize: "2rem",
  },
  modal: {
    gap: "10px",
  },
};

function AdminHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => setIsModalOpen(prevState => !prevState);

  return (
    <Stack sx={muiStyles.header} direction="row" justifyContent="space-between">
      <Typography component="h1" sx={muiStyles.heading}>
        Admin Panel
      </Typography>
      <PrimaryButton onClick={handleModalToggle}>
        Invite User
      </PrimaryButton>
      <ModalWrapper
        title="Invite user"
        isOpen={isModalOpen}
        handleToggle={handleModalToggle}
        style={muiStyles.modal}
      >
        <UserInvitationForm />
      </ModalWrapper>
    </Stack>
  );
}

export default function Admin() {
  const { pathname } = useLocation();

  return (
    <Box component="main" p="32px 0">
      <Container mb="20px">
        <AdminHeader />
      </Container>

      <Container mb="20px">
        <Tabs
          component="nav"
          value={pathname}
        >
          <Tab
            label="Existing Users"
            value="/admin"
            component={NavLink}
            to="/admin"
          />
          <Tab
            label="Invitations"
            value="/admin/invitations"
            component={NavLink}
            to="invitations"
          />
        </Tabs>
      </Container>

      <Outlet />
    </Box>
  );
}
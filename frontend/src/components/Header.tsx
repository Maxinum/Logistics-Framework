import { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import { ROUTES } from "../utils/constants";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar
} from "@mui/material";
import { Container } from ".";
import Logo from "../assets/logo.png";

type CustomNavLinkProps = {
  path: string;
  children: React.ReactNode;
};

const muiStyles = {
  avatar: {
    width: "33px",
    height: "33px",
  },
  navLink: {
    borderRadius: "0",
    borderBottom: "inherit",
    textTransform: "capitalize",
    marginRight: "24px",
    "&.active": {
      borderBottom: "1px solid",
    },
    padding: "4px 6px",
  },
  nav: {
    color: "var(--blue)",
    margin: "0 auto",
  },
  mainBlock: {
    backgroundColor: "#fff",
  },
};

function CustomNavLink({ path, children }: CustomNavLinkProps) {
  return (
    <Button
      color="inherit"
      component={NavLink}
      to={path}
      sx={muiStyles.navLink}
    >
      {children}
    </Button>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!user) setAnchorElUser(null);
  }, [user]);

  if (!user) return null;

  return (
    <AppBar position="static" sx={muiStyles.mainBlock}>
      <Container>
        <Toolbar disableGutters>
          <Button component={NavLink} to="/" sx={{ padding: 0 }}>
            <img src={Logo} width={107} alt="Logistics Framework" />
          </Button>

          <Box component="nav" sx={muiStyles.nav}>
            {ROUTES.map(route =>
              <CustomNavLink key={route.label} path={route.path}>
                {route.label}
              </CustomNavLink>
            )}

            {user?.role === "Admin"
              ? <CustomNavLink path="/admin">
                Admin panel
              </CustomNavLink>
              : null
            }
          </Box>

          <Button
            size="small"
            sx={{ color: "var(--blue)", padding: 0 }}
            startIcon={<Avatar sx={muiStyles.avatar} alt={`${user?.name} ${user?.surname}`} />}
            onClick={({ currentTarget }) => setAnchorElUser(currentTarget)}
          >
            {`${user?.name} ${user?.surname}`}
          </Button>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem onClick={logout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
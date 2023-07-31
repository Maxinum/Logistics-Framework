import { Typography, TypographyProps } from "@mui/material";
import { Link, LinkProps } from "react-router-dom";
import React from "react";

type UnderlinedLinkProps = {
  to: string;
  children: React.ReactNode;
};

const muiStyles = {
  link: {
    color: "var(--blue)",
    textDecoration: "underline",
  },
};

export default function UnderlinedLink({
  to,
  children,
  ...rest
}: UnderlinedLinkProps & TypographyProps & LinkProps) {
  return (
    <Typography
      {...rest}
      component={Link as React.ComponentType<LinkProps>}
      to={to}
      sx={muiStyles.link}
    >
      {children}
    </Typography>
  );
}
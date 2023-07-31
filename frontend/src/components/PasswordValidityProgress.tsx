import { Box, List, ListItem, ListSubheader, ListItemText } from "@mui/material";

const rules = [
  { rule: /[0-9]/, description: "Have at least one digit" },
  { rule: /[A-Z]/, description: "Have at least one uppercase letter" },
  { rule: /[a-z]/, description: "Have at least one lowercase letter" },
  { rule: /[\W_]/, description: "Have at least one special character" },
  { rule: /^.{8,}$/, description: "Be at least 8 characters long" },
];

const muiStyles = {
  invalid: {
    opacity: 0.65,
  },
  valid: {
    color: 1,
    "& > .MuiBox-root": {
      backgroundColor: "#66de86",
    },
  },
  check: {
    border: "2px solid #b8b8b8",
    borderRadius: "100%",
    margin: "0 8px 2px 0",
    transition: "all 100ms",
    height: "0.65em",
    width: "0.65em",
  },
};

/**
 * Renders a progress list for password validity based on a set of rules.
 * @param password - The password to check against the rules.
 */
export default function PasswordValidityProgress({ password }: { password: string; }) {
  const validChecks = rules.map(({ rule }) => rule.test(password));

  return (
    <List dense subheader={<ListSubheader>Password must:</ListSubheader>}>
      {rules.map((rule, index) =>
        <ListItem
          key={`password-validity-progress-${index}`}
          sx={validChecks[index] ? muiStyles.valid : muiStyles.invalid}
        >
          <Box sx={muiStyles.check} aria-hidden />
          <ListItemText>{rule.description}</ListItemText>
        </ListItem>
      )}
    </List>
  );
}
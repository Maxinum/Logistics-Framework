import UsersFilter from "./components/UsersFilter";
import UsersTable from "./components/UsersTable";
import { Container } from "../../../components";

export default function ExistingUsersSection() {
  return (
    <Container
      component="section"
      display="grid"
      columnGap="20px"
      alignItems="start"
      gridTemplateColumns="0.14fr 0.86fr"
    >
      <UsersFilter />
      <UsersTable />
    </Container>
  );
}
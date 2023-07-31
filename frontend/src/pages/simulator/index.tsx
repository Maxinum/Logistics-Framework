import OffersHeader from "./components/OffersHeader";
import OffersFilter from "./components/OffersFilter";
import OffersTable from "./components/OffersTable";
import { Container } from "../../components";
import { Box } from "@mui/material";

export default function Simulator() {
  return (
    <Box component="main" p="20px 0">
      <Container mb="20px">
        <OffersHeader />
      </Container>

      <Container
        display="grid"
        columnGap="20px"
        alignItems="start"
        gridTemplateColumns="0.13fr 0.87fr"
      >
        <div><OffersFilter /></div>
        <div><OffersTable /></div>
      </Container>
    </Box>
  );
}
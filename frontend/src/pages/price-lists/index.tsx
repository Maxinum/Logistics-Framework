import { NavLink, Outlet, Link } from "react-router-dom";
import { PriceList } from "../../utils/types";
import { Box, Tabs, Tab } from "@mui/material";
import { Container, PrimaryButton } from "../../components";
import PriceListsTable from "./components/PriceListsTable";

export default function PriceLists() {
  const urlParams = new URLSearchParams(location.search);
  const currentCategory = urlParams.get("category") as PriceList["category"] || "cc-destination";

  return (
    <Box component="main" p="20px 0">
      <Container
        mb="28px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Tabs
          component="nav"
          value={currentCategory}
          sx={{ borderColor: "var(--blue)" }}
        >
          <Tab
            value="cc-destination"
            label="CC Destination"
            component={NavLink}
            to=""
          />
          <Tab
            value="inland-carrier"
            label="Inland Carrier"
            component={NavLink}
            to="?category=inland-carrier"
          />
          <Tab
            value="forwarder"
            label="Forwarder"
            component={NavLink}
            to="?category=forwarder"
          />
          <Tab
            value="inland-supplier"
            label="Inland Supplier"
            component={NavLink}
            to="?category=inland-supplier"
          />
          <Tab
            value="local-charges"
            label="Local Charges"
            component={NavLink}
            to="?category=local-charges"
          />
        </Tabs>

        <PrimaryButton
          size="small"
          sx={{ height: "40px" }}
          component={Link}
          to={`create${location.search}`}
        >
          Add Price List
        </PrimaryButton>
      </Container>

      <Container>
        <PriceListsTable category={currentCategory} />
      </Container>

      <Outlet />
    </Box>
  );
}
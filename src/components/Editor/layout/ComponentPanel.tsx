import { Grid } from "@mui/material";

import ComponentTag from "../components/ComponentTag";
import { getComponentSchemas } from "../config/schemaConfig";

const componentSchemas = getComponentSchemas();

export default function ConfigurationPanel() {
  return (
    <Grid container p={1} spacing={1}>
      {componentSchemas.map((schema) => (
        <Grid item xs={6} key={schema.type}>
          <ComponentTag type={schema.type} label={schema.label} />
        </Grid>
      ))}
    </Grid>
  );
}

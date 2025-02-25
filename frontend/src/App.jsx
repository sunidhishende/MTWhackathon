import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import "./layout.css";

import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { defaultTheme } from "./theme";

export default function App() {
  return (
    <div className="App">
      <MantineProvider defaultColorScheme="dark" theme={defaultTheme}>
        <Router>
          <Dashboard />
        </Router>
      </MantineProvider>
    </div>
  );
}

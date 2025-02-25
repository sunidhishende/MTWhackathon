import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Homepage from "./pages/homepage";
import { defaultTheme } from "./theme";

export default function App() {
  return (
    <div className="App">
      <MantineProvider defaultColorScheme="light" theme={defaultTheme}>
        <Router>
          <div>
            <main>
              <Routes>
                <Route path="/" element={<Homepage />} />
                {/* <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/terminal" element={<Terminal />} /> */}
              </Routes>
            </main>
          </div>
        </Router>
      </MantineProvider>
    </div>
  );
}

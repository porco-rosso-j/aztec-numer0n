import "@mantine/core/styles.css";
import { MantineProvider, AppShell} from "@mantine/core";
import { theme } from "./theme";
import Game from "./components/Game";

export default function App() {
  return (
    <MantineProvider theme={theme}>    
      <AppShell withBorder>
        <AppShell.Main >
          <Game>
          </Game>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
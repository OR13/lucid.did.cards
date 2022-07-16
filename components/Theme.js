import { ThemeProvider, createTheme } from "@mui/material";
import { blue, deepPurple, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: grey[800],
    },
    primary: {
      main: deepPurple["200"],
    },
    secondary: {
      main: blue["A200"],
    },
  },
});

const Theme = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;

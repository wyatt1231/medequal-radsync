import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    header: {
      backgroundColor?: string;
      height?: number;
      color?: string;
      activeNavColor?: string;
    };

    sidebar?: {
      maxWidth?: number;
      minWidth?: number;
      backgroundColor?: string;
      color?: string;
    };

    body?: {
      backgroundColor?: string;
      color?: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    header?: {
      backgroundColor?: string;
      height?: number;
      color?: string;
      activeNavColor?: string;
    };

    sidebar?: {
      maxWidth?: number;
      minWidth?: number;
      backgroundColor?: string;
      color?: string;
    };

    body?: {
      backgroundColor?: string;
      color?: string;
    };
  }
}

let theme = createTheme({
  header: {
    backgroundColor: "#e2f3f5",
    height: 65,
    color: "black",
    activeNavColor: `#eac100`,
  },
  sidebar: {
    maxWidth: 250,
    minWidth: 65,
    backgroundColor: "#fdfdfd",
    color: "black",
  },
  body: {
    backgroundColor: "unset",
    color: `black`,
  },

  typography: {
    button: {
      // textTransform: "unset",
    },
    // subtitle1: {
    //   textTransform: `uppercase`,
    // },

    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  // spacing: 4,
});

// theme = responsiveFontSizes(theme);

export default theme;

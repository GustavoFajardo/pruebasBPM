import { createTheme, makeStyles } from "@material-ui/core";
import { esES as coreEsEs, esES } from '@mui/material/locale';


export const inputsTheme = createTheme({
  palette: {
    success: {
      main: "#3E7C17",
    },
    error: {
      main: "#9b241b",
    },
    secondary: {
      main: "#9D9D9D",
    },
    primary: {
      main: "#3ba3c6",
    },
    warning: {
      main: "#F7F7F7",
    },
  }
},
  esES, coreEsEs);


export const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1500,
    // color: '#fff',
  },
  logo: {
    // [theme.breakpoints.down('xl')]: {
    //   width: '40px !important',
    //   height: '50px !important'
    // },
    width: 'auto !important',
    height: 'auto !important',
    margin: 5
  },
  field: {
    margin: "0.5rem",
    display: "block",
    color: "#0d6efd"
  },
  button: {
    margin: "0.5rem",
    display: "block"
  },
  root: {
    "& .MuiTableCell-root": { height: "auto", paddingTop: 0, paddingBottom: 0 },
    "& .MuiSpeedDial-root	.directionLeft": { position: "absolute" },
    "& .Mui-disabled .MuiStepIcon-root": { color: "#F2C438" },
    "& .MuiCheckbox-root .MuiSvgIcon-root ": { color: "#0d6efd" },
    "& .MuiSvgIcon-root, .Mui-active": { color: "#0d6efd" },
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "#000000",
      paddingTop: 20, paddingBottom: 20
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "& .MuiToolbar-root": {
      color: "white",
      backgroundColor: "#000000"
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#46005d"
    }
    ,
    "& .MuiIconButton-root": {
      backgroundColor: "#fff"
    }
  },
  tableCell: {
    /* paddingTop: 0,
    paddingBottom: 0 */
  }
}));




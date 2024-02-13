import { extendTheme } from "@chakra-ui/react";

//
//
// NOTE :
// if you don't provide nothing
// this is the default:
//
// const defaultChakraConfig = {
//   initialColorMode: 'light'
//   useSystemColorMode: false,
// }
//
//
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

export const chakraCustomTheme = extendTheme({
  config,

  colors: {
    light: {
      500: '#38a169', // Light green color
    },
  },
  styles: {
    global: (props:any) => ({
      body: {
        bg: props.colorMode === 'light' ? '#F9F9F9' : 'gray.800', // Use light green in light mode
      },
    }),
  },
  
});

//
//
//
export function deleteColorModeInLocalStorage() {
  window.localStorage.removeItem("chakra-ui-color-mode");
  console.log('deleted "chakra-ui-color-mode" from local storage');
  console.log("You can now refresh to see how a first visit looks like.");
}

// After 3s reset the localStorage
//setTimeout(deleteColorModeInLocalStorage, 3000);

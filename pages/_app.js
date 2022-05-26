import "../styles/globals.css";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff").then((liff) => {
      console.log("start liff.init()...");
      liff
        .init({ liffId: process.env.LIFF_ID })
        .then(() => {
          console.log("liff.init() done");
          console.log(liff.getLanguage());
          console.log(liff.getVersion());
          console.log(liff.isInClient());
          console.log(liff.isLoggedIn());
          console.log(liff.getOS());
          console.log(liff.getLineVersion());
          setLiffObject(liff);

// sendMessages call
if (!liff.isInClient()) {
  window.alert('This button is unavailable as LIFF is currently being opened in an external browser.');
} else {
  liff.sendMessages([
      {
          type: 'text',
          text: 'Hello, World!',
      },
  ])
      .then(() => {
          window.alert('Message sent');
      })
      .catch((error) => {
          window.alert('Error sending message: ' + error);
      });
}

        })
        .catch((error) => {
          console.log(`liff.init() failed: ${error}`);
          if (!process.env.liffId) {
            console.info(
              "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
            );
          }
          setLiffError(error.toString());
        });
    });
  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return <Component {...pageProps} />;
}

export default MyApp;

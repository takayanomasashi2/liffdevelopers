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



          if (liff.isApiAvailable("shareTargetPicker")) {
            liff
              .shareTargetPicker(
                [
                  {
                    type: "text",
                    text: "Hello, World!",
                  },
                ],
                {
                  isMultiple: true,
                }
              )
              .then(function (res) {
                if (res) {
                  // succeeded in sending a message through TargetPicker
                  console.log(`[${res.status}] Message sent!`);
                } else {
                  const [majorVer, minorVer] = (liff.getLineVersion() || "").split(".");
                  if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
                    // LINE 10.3.0 - 10.10.0
                    // Old LINE will access here regardless of user's action
                    console.log(
                      "TargetPicker was opened at least. Whether succeeded to send message is unclear"
                    );
                  } else {
                    // LINE 10.11.0 -
                    // sending message canceled
                    console.log("TargetPicker was closed!");
                  }
                }
              })
              .catch(function (error) {
                // something went wrong before sending a message
                console.log("something wrong happen");
              });
          }




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

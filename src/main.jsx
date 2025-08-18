import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/style/index.css";
import Router from "./Router";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  </StrictMode>
);

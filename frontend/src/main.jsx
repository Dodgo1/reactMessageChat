import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import MainPage from "./routes/mainPage.jsx";
import { ApolloProvider } from "@apollo/client";
import ChatPage from "/src/routes/chatPage.jsx";

import {client} from "./apollo/apollo.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
    },  {
        path: "/chat/:chatHash",
        element:<ChatPage/>
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
  </React.StrictMode>,
)

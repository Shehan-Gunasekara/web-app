"use client";

import React from "react";
import { ApolloLink, HttpLink, concat } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
  ApolloNextAppProvider,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { useAuthContext } from "@/app/providers/AuthProvider";

const MakeClient = () => {
  // Create a new HTTP link pointing to the GraphQL endpoint
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  });

  const { getCurrentSession } = useAuthContext();

  // const fetchData = async () => {
  //   await getCurrentSession();
  // };

  // const authLink = new ApolloLink((operation, forward) => {
  //   // Get the jwt token from local storage
  //   fetchData();

  //   const jwtToken = localStorage.getItem("jwt-token");

  //   // Include the token in the request headers
  //   operation.setContext({
  //     headers: {
  //       authorization: jwtToken ? `Bearer ${jwtToken}` : "",
  //     },
  //   });

  //   return forward(operation);
  // });

  const authLink = setContext(async () => {
    // Get access token stored in cookie
    const tokens = await getCurrentSession();

    const accessToken = tokens?.accessToken;

    const token = accessToken ? accessToken.toString() : "";

    // Return authorization headers with the token as a Bearer token
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink,
            httpLink,
          ])
        : concat(authLink, httpLink),
  });
};

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={MakeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "./providers/AuthProvider";

export default function Home() {
  const { getCurrentSession } = useAuthContext();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const user = await getCurrentSession();
        if (user) {
          if (!pathname.includes("/dashboard")) {
            replace("/dashboard/orders");
          } else {
            replace(pathname);
          }
        } else {
          replace("/auth/sign-in");
        }
      } catch (_error) {
        console.error("Session retrieval failed");
      }
    };

    redirectUser();
  }, [pathname, getCurrentSession, replace]);

  return <div></div>;
}

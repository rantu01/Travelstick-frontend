"use client";
import { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { fetchPublicSettings, getUser } from "../helper/backend";
import EnvContext from "../contexts/encContext";
import UserContext from "../contexts/user";
import { useFetch } from "../helper/hooks";

const Providers = ({ children }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    getCurrentUser();
  }, [])

  const getCurrentUser = async () => {
    const { data, success } = await getUser();
    if (success === true) {
      setUser(data);
    } else {
      setUser(null);
    }
  };

  const [settings, getSettings] = useFetch(fetchPublicSettings);

  return (
    <EnvContext.Provider value={{ settings, getSettings}} >
      <UserContext.Provider value={{ user, setUser, getCurrentUser}}>
        <SkeletonTheme color="#0F172A" highlightColor="#444">
          {children}
        </SkeletonTheme>
      </UserContext.Provider>
    </EnvContext.Provider>
  )
}

export default Providers;
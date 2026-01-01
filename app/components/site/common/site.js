"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
const SiteContext = createContext({});
const LIBRARIES = ['places', 'drawing'];

export const useSite = () => useContext(SiteContext);

const SiteProvider = ({ children, settings, isAdmin = false }) => {
    const [siteSettings, setSiteSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const mapKey = process.env.google_map_api_key;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: mapKey,
        libraries: LIBRARIES
    });

    const getSettings = useCallback(async () => {
        if (!isLoading) return;

        try {
            let res;
            if (isAdmin) {
                res = await fetch(`${process.env.backend_url}api/v1/settings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token") ?? ""}`,
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store'
                });
            } else {
                res = await fetch(`${process.env.backend_url}api/v1/settings/site`, {
                    cache: 'no-store'
                });
            }

            const newSettings = await res.json();
            setSiteSettings(newSettings?.data);
            setIsLoading(false);
            return newSettings;
        } catch (error) {
            console.error("🚀 ~ getSettings ~ error:", error);
            setIsLoading(false);
            return null;
        }
    }, [isAdmin, isLoading]);

    useEffect(() => {
        getSettings();
    }, [getSettings]);

    return (
        <SiteContext.Provider value={{ ...siteSettings, isGoogleMapLoaded: isLoaded, getSettings, isLoading }}>
            {children}
        </SiteContext.Provider>
    );
};

export default SiteProvider;
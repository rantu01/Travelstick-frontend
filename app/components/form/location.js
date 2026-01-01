"use client";

import { useI18n } from "@/app/contexts/i18n";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

// Function to dynamically load the Google Maps script
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (typeof window.google !== "undefined") return resolve(); // Already loaded
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps API failed to load"));
    document.head.appendChild(script);
  });
};

export const MapSelector = ({
  value,
  onChange,
  country,
  height = 400,
  isGoogleMap = true,
  disabled = false,
  apiKey,
  placeholder,
  inputHidden = false,

 
}) => {
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [autocomplete, setAutocomplete] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const i18n = useI18n();

  useEffect(() => {
    loadGoogleMapsScript(process.env.GOOGLE_MAP_API_KEY)
      .then(() => setGoogleLoaded(true))
      .catch((err) => console.error("Google Maps failed to load:", err));
  }, [apiKey]);

  useEffect(() => {
    if (country && googleLoaded && !value?.name) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: country }).then(({ results }) => {
        if (results?.length > 0) {
          const result = results[0];
          onChange({
            name: "",
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            country: result.address_components.find((c) =>
              c.types.includes("country")
            )?.short_name,
            country_long: result.address_components.find((c) =>
              c.types.includes("country")
            )?.long_name,
            city: result.address_components.find((c) =>
              c.types.includes("locality")
            )?.long_name,
          });
        }
      });
    }
  }, [country, googleLoaded]);

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setCenter({ lat: value.lat, lng: value.lng });
      setZoom(13);
    }
  }, [value]);

  const getLocation = (location) => {
    if (!googleLoaded || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }).then((response) => {
      if (response.results[0]) {
        onChange({
          name: response.results[0].formatted_address,
          lat: location.lat,
          lng: location.lng,
        });
      }
    });
  };

  if (!googleLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      <div className={`relative ${inputHidden && "hidden"}`}>
        <Autocomplete
          onLoad={setAutocomplete}
          onPlaceChanged={() => {
            const addressObject = autocomplete?.getPlace();
            onChange({
              name: addressObject?.formatted_address,
              lat: addressObject?.geometry?.location.lat(),
              lng: addressObject?.geometry?.location.lng(),
              country: addressObject?.address_components?.find((c) =>
                c.types.includes("country")
              )?.short_name,
              country_long: addressObject?.address_components?.find((c) =>
                c.types.includes("country")
              )?.long_name,
              city: addressObject?.address_components?.find((c) =>
                c.types.includes("locality")
              )?.long_name,
            });
          }}
        >
          <input
            disabled={disabled}
            className={`w-full rounded bg-transparent p-3 dashinput ${isGoogleMap && "mb-4"}`}
            placeholder={placeholder}
            value={value?.name || ""}
            onChange={(e) =>
              onChange({ ...value, name: e.target.value })
            }
          />
        </Autocomplete>
      </div>

      {isGoogleMap && (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: height,
            borderRadius: 5,
            marginBottom: 8,
          }}
          center={center}
          zoom={zoom}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControlOptions: { position: 9 },
          }}
        >
          {value?.lat && value?.lng && (
            <Marker
              position={{ lat: value.lat, lng: value.lng }}
              draggable
              onDragEnd={(e) => {
                const location = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                };
                getLocation(location);
              }}
            />
          )}
        </GoogleMap>
      )}
    </>
  );
};

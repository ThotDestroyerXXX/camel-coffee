"use client";

import { useState, useCallback, useEffect, memo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple, Map as LeafletMap } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  onMove?: (latlng: LatLngTuple) => void;
  onMoveEnd?: (latlng: LatLngTuple) => void;
  interactive?: boolean;
}

const defaults = {
  zoom: 19,
};

function CenterMarkerSync({
  setCenter,
  notifyEnd,
}: {
  setCenter: (latlng: LatLngTuple) => void;
  notifyEnd?: (latlng: LatLngTuple) => void;
}) {
  // Event handler using useMapEvents
  useMapEvents({
    move: (e) => {
      const map = e.target as LeafletMap;
      const center = map.getCenter();
      setCenter([center.lat, center.lng]);
    },
    moveend: (e) => {
      if (notifyEnd) {
        const map = e.target as LeafletMap;
        const center = map.getCenter();
        notifyEnd([center.lat, center.lng]);
      }
    },
  });
  return null;
}
CenterMarkerSync.displayName = "CenterMarkerSync";

// Extracted marker component
const LocationMarker = memo(({ position }: { position: LatLngTuple }) => (
  <Marker position={position}>
    <Popup>
      Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
    </Popup>
  </Marker>
));
LocationMarker.displayName = "LocationMarker";

function SearchControl() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const provider = new OpenStreetMapProvider();

    const search = GeoSearchControl({
      provider: provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
    });

    map.addControl(search);

    return () => {
      map.removeControl(search);
    };
  }, [map]);

  return null;
}

const MyMap = (props: MapProps) => {
  const {
    zoom = defaults.zoom,
    posix,
    onMove,
    onMoveEnd,
    interactive = true,
  } = props;
  const [center, setCenter] = useState<LatLngTuple>(
    Array.isArray(posix) ? posix : [posix.lat, posix.lng]
  );
  const isInternalUpdate = useRef(false);

  // Sync with external posix changes, but only if not from internal update
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setCenter(Array.isArray(posix) ? posix : [posix.lat, posix.lng]);
    }
    isInternalUpdate.current = false;
  }, [posix]);

  // Memoized event handler
  const handleSetCenter = useCallback(
    (latlng: LatLngTuple) => {
      isInternalUpdate.current = true;
      setCenter(latlng);
      onMove?.(latlng);
    },
    [onMove]
  );

  const handleMoveEnd = useCallback(
    (latlng: LatLngTuple) => {
      onMoveEnd?.(latlng);
    },
    [onMoveEnd]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      dragging={interactive}
      touchZoom={interactive}
      doubleClickZoom={interactive}
      zoomControl={interactive}
      attributionControl={interactive}
      scrollWheelZoom={interactive}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      {interactive && <SearchControl />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {interactive && (
        <CenterMarkerSync
          setCenter={handleSetCenter}
          notifyEnd={handleMoveEnd}
        />
      )}
      <LocationMarker position={center} />
    </MapContainer>
  );
};

MyMap.displayName = "MyMap";

export default memo(MyMap);

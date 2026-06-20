import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { STATIONS } from "../../redux/actions/stations";
import {
  Station,
  StationsCollection,
  OptionsState,
  UpdateState,
  SubscriptionState,
  CenterState,
  LatLng,
} from "../../types";
import "./Stations.scss";

import HexbinLayer from "./HexBinLayer";
import Dashboard from "../Dashboard/Dashboard";

interface MapControllerProps {
  position: LatLng | null;
  center: CenterState | null;
  onMoveStart: () => void;
  onMoveEnd: () => void;
  onZoomEnd: () => void;
}

function MapController({
  position,
  center,
  onMoveStart,
  onMoveEnd,
  onZoomEnd,
}: MapControllerProps) {
  const map = useMap();
  const prevPositionRef = useRef<LatLng | null>(null);
  const prevCenterRef = useRef<CenterState | null>(null);

  useMapEvents({
    movestart: onMoveStart,
    moveend: onMoveEnd,
    zoomend: onZoomEnd,
  });

  useEffect(() => {
    map.zoomControl.setPosition("bottomleft");
  }, [map]);

  useEffect(() => {
    if (position && position !== prevPositionRef.current) {
      prevPositionRef.current = position;
      map.setView(position, 13);
    }
  }, [position, map]);

  useEffect(() => {
    if (center?.station && center !== prevCenterRef.current) {
      prevCenterRef.current = center;
      map.setView(
        {
          lat: center.station.geometry.coordinates[0],
          lng: center.station.geometry.coordinates[1],
        },
        13,
      );
    }
  }, [center, map]);

  return null;
}

interface HexbinDatum {
  o: { properties: { id: string; provider: string } };
}

interface Props {
  stations: StationsCollection;
  options: OptionsState;
  update: UpdateState;
  updating: boolean;
  media: string;
  position: LatLng;
  center: CenterState;
  favboard: boolean;
  clusterboard: boolean;
  subscription: SubscriptionState;
  onFavorizeStation: (id: string) => void;
  onUnfavorizeStation: (id: string) => void;
  onNotifyStation: (id: string) => void;
  onUnnotifyStation: (id: string) => void;
  onSetFavboard: (p: { state: boolean; feature: string }) => void;
  onSetClusterboard: (p: { state: boolean; feature: string }) => void;
  onFetchStations: (
    url: string,
    provider: string,
    method: string,
    loc: LatLng,
  ) => void;
  onSetCenter: (station: Station) => void;
  children?: React.ReactNode;
}

export default function Stations(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [clusterIds, setClusterIds] = useState<string[]>([]);
  const [zoomEnd, setZoomEnd] = useState(false);
  const [moveEnd, setMoveEnd] = useState(false);
  const [hasCenterPending, setHasCenterPending] = useState(false);

  const centerTimeoutRef = useRef<number>(0);
  const prevPositionRef = useRef<LatLng | null>(null);
  const prevCenterRef = useRef<CenterState | null>(null);

  useEffect(() => {
    if (props.position && props.position !== prevPositionRef.current) {
      prevPositionRef.current = props.position;
      navigate("/");
    }
  }, [props.position, navigate]);

  useEffect(() => {
    if (props.center && props.center !== prevCenterRef.current) {
      prevCenterRef.current = props.center;
      setHasCenterPending(true);
      setZoomEnd(false);
      setMoveEnd(false);
    }
  }, [props.center]);

  useEffect(() => {
    if (hasCenterPending && (moveEnd || zoomEnd) && props.center?.station) {
      centerTimeoutRef.current = window.setTimeout(() => {
        const { provider, id } = props.center.station!.properties;
        navigate(`/station/${provider}/${id}/center`, {
          state: { x: "50%", y: "50%" },
        });
        setHasCenterPending(false);
      }, 200);
    }
    return () => window.clearTimeout(centerTimeoutRef.current);
  }, [hasCenterPending, moveEnd, zoomEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    stations,
    media,
    favboard,
    clusterboard,
    onSetFavboard,
    onSetClusterboard,
  } = props;

  const handleHexClick = useCallback(
    (d: HexbinDatum[], _i: number, coords: [number, number]) => {
      if (d.length <= 1) {
        navigate(
          `/station/${d[0].o.properties.provider}/${d[0].o.properties.id}`,
          {
            state: { x: coords[0], y: coords[1] },
          },
        );
      } else {
        const ids = d
          .map((item) =>
            stations.features.find(
              (s) => s.properties.id === item.o.properties.id,
            ),
          )
          .filter(Boolean)
          .map((s) => s!.properties.id);
        setClusterIds(ids);
        onSetClusterboard({ state: true, feature: STATIONS });
        navigate("/clusterboard");
      }
    },
    [navigate, stations, onSetClusterboard],
  );
  const handleMoveStart = useCallback(() => {
    if (
      location.pathname === "/bottomsheet" ||
      location.pathname.includes("/station")
    )
      navigate("/");
    if (media === "small" && favboard) {
      navigate("/");
      onSetFavboard({ state: false, feature: STATIONS });
    }
    if (clusterboard) {
      navigate("/");
      onSetClusterboard({ state: false, feature: STATIONS });
    }
  }, [
    location.pathname,
    navigate,
    media,
    favboard,
    clusterboard,
    onSetFavboard,
    onSetClusterboard,
  ]);

  const handleMoveEnd = useCallback(() => setMoveEnd(true), []);
  const handleZoomEnd = useCallback(() => setZoomEnd(true), []);

  const locationMarker = props.position
    ? (() => {
        const icon = L.divIcon({
          html: "",
          className: "air__icon-location",
          iconSize: [12, 12],
        });
        return <Marker icon={icon} position={props.position} />;
      })()
    : null;

  const hexbins = props.stations.features.length ? (
    <HexbinLayer
      data={props.stations}
      updating={props.updating}
      timestamp={props.update.timestamp}
      onClick={handleHexClick}
    />
  ) : null;

  const initialCenter: [number, number] = props.position
    ? [props.position.lat, props.position.lng]
    : [48.3, 14.3];

  return (
    <>
      <MapContainer
        className="air__stations"
        center={initialCenter}
        zoom={13}
        maxZoom={15}
        minZoom={2}
        preferCanvas
        doubleClickZoom={false}
      >
        <MapController
          position={props.position}
          center={props.center}
          onMoveStart={handleMoveStart}
          onMoveEnd={handleMoveEnd}
          onZoomEnd={handleZoomEnd}
        />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {locationMarker}
        {hexbins}
        {props.children}
      </MapContainer>

      <AnimatePresence>
        {props.clusterboard && (
          <motion.div
            className="air__site air__site--favboard air__site--cluster"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.15, ease: [0.53, 0.04, 0.83, 0.88] }}
          >
            <Dashboard
              stations={props.stations}
              header="Cluster"
              options={props.options}
              media={props.media}
              subscription={props.subscription}
              onSetFavboard={props.onSetFavboard}
              onSetClusterboard={props.onSetClusterboard}
              onFavorizeStation={props.onFavorizeStation}
              onUnfavorizeStation={props.onUnfavorizeStation}
              onNotifyStation={props.onNotifyStation}
              onUnnotifyStation={props.onUnnotifyStation}
              onSetCenter={props.onSetCenter}
              getActive={clusterIds}
              type="cluster"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

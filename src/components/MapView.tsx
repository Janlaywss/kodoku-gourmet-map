"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Restaurant } from "@/data";
import { categoryColor, categoryEmoji } from "@/data/categories";
import type { Locale, Messages } from "@/i18n/messages";

const TOKYO_CENTER: [number, number] = [139.751, 35.685];
const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12";
const CLOSED_MARKER_COLOR = "#8d8a84";
const HOVER_CLOSE_DELAY = 180;

function mapLanguage(locale: Locale): string {
  if (locale === "zh-CN") return "zh-Hans";
  if (locale === "zh-TW" || locale === "zh-HK") return "zh-Hant";
  return locale;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function statusClass(status: Restaurant["status"]): string {
  if (status === "营业中") return "st-open";
  if (status === "已闭店") return "st-closed";
  return "st-unknown";
}

function popupContent(
  restaurant: Restaurant,
  locale: Locale,
  messages: Messages,
): HTMLElement {
  const text = restaurant.i18n?.[locale];
  const root = element("div", "pop mapbox-pop");
  const head = element("div", "pop-head");
  const emoji = element("div", "pop-emoji", categoryEmoji(restaurant.category));
  emoji.style.background = categoryColor(restaurant.category);
  head.append(emoji);

  const names = element("div", "pop-titles");
  names.append(element("div", "pop-name", restaurant.name));
  if (text?.name && text.name !== restaurant.name) {
    names.append(element("div", "pop-namezh", text.name));
  }
  head.append(names);
  root.append(head);

  const badges = element("div", "pop-badges");
  badges.append(
    element(
      "span",
      "badge badge-ep",
      messages.episodeBadge(restaurant.seasonKey, restaurant.episode),
    ),
  );
  const category = element(
    "span",
    "badge badge-cat",
    messages.categories[restaurant.category] ?? restaurant.category,
  );
  category.style.background = categoryColor(restaurant.category);
  badges.append(category);
  badges.append(
    element(
      "span",
      `badge badge-st ${statusClass(restaurant.status)}`,
      messages.status[restaurant.status],
    ),
  );
  root.append(badges);

  const rows: Array<[string, string | undefined]> = [
    [messages.popDish, text?.dish ?? restaurant.dish],
    [messages.popAddress, text?.address ?? restaurant.address],
    [messages.popNotes, text?.notes ?? restaurant.notes],
  ];
  for (const [label, value] of rows) {
    if (!value) continue;
    const row = element("div", "pop-row");
    row.append(element("span", "pop-label", label), element("span", "", value));
    root.append(row);
  }

  const links = element("div", "pop-links");
  const linkData = [
    [
      messages.popGoogle,
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${restaurant.name} ${restaurant.address}`,
      )}`,
    ],
    [
      messages.popTabelog,
      `https://tabelog.com/rstLst/?sw=${encodeURIComponent(restaurant.name)}`,
    ],
  ];
  for (const [label, href] of linkData) {
    const link = element("a", "", label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    links.append(link);
  }
  root.append(links);
  return root;
}

function tooltipContent(restaurant: Restaurant, locale: Locale): HTMLElement {
  const text = restaurant.i18n?.[locale];
  const root = element("div", "map-tip");
  root.append(
    element("span", "tip-name", restaurant.name),
    element("span", "tip-dish", text?.dish ?? restaurant.dish),
  );
  return root;
}

export default function MapView({
  restaurants,
  selectedId,
  onSelect,
  locale,
  messages,
  accessToken,
  styleUrl = DEFAULT_STYLE,
}: {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  locale: Locale;
  messages: Messages;
  accessToken: string;
  styleUrl?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markersRef = useRef(new Map<string, mapboxgl.Marker>());
  const onSelectRef = useRef(onSelect);
  const initialLocaleRef = useRef(locale);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(!accessToken);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!accessToken || !containerRef.current) {
      setError(true);
      return;
    }

    let active = true;
    setReady(false);
    setError(false);

    const map = new mapboxgl.Map({
      accessToken,
      container: containerRef.current,
      style: styleUrl,
      center: TOKYO_CENTER,
      zoom: 10.5,
      language: mapLanguage(initialLocaleRef.current),
      localIdeographFontFamily:
        '"Hiragino Sans", "PingFang SC", "Noto Sans CJK JP", sans-serif',
      attributionControl: true,
      respectPrefersReducedMotion: true,
    });
    mapRef.current = map;
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: "restaurant-detail",
      maxWidth: "340px",
      offset: 20,
    });
    const handlePopupClose = () => {
      if (active) onSelectRef.current(null);
    };
    popup.on("close", handlePopupClose);
    popupRef.current = popup;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100 }), "bottom-right");

    const handleLoad = () => {
      if (!active) return;
      setReady(true);
      setError(false);
    };
    const handleError = () => {
      if (active && !map.loaded()) setError(true);
    };
    const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
      const target = event.originalEvent.target;
      if (
        target instanceof Element &&
        target.closest(
          ".mapboxgl-marker, .mapboxgl-popup, .map-actions, .mapboxgl-control-container",
        )
      ) {
        return;
      }
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
        hoverCloseTimerRef.current = null;
      }
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
      onSelectRef.current(null);
    };

    map.on("load", handleLoad);
    map.on("error", handleError);
    map.on("click", handleMapClick);

    return () => {
      active = false;
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
        hoverCloseTimerRef.current = null;
      }
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
      popup.off("close", handlePopupClose);
      popup.remove();
      popupRef.current = null;
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken, styleUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setLanguage(mapLanguage(locale));
  }, [locale, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
    hoverPopupRef.current?.remove();
    hoverPopupRef.current = null;

    const cancelHoverClose = () => {
      if (!hoverCloseTimerRef.current) return;
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    };
    const closeHoverPopup = () => {
      cancelHoverClose();
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
    };
    const scheduleHoverClose = () => {
      cancelHoverClose();
      hoverCloseTimerRef.current = setTimeout(
        closeHoverPopup,
        HOVER_CLOSE_DELAY,
      );
    };

    for (const restaurant of restaurants) {
      const pin = element(
        "button",
        "gpin mapbox-gpin",
        categoryEmoji(restaurant.category),
      );
      pin.type = "button";
      pin.title = restaurant.name;
      pin.setAttribute("aria-label", restaurant.name);
      if (restaurant.status === "已闭店") {
        pin.style.setProperty("--c", CLOSED_MARKER_COLOR);
        pin.classList.add("gpin-closed");
      } else {
        pin.style.setProperty("--c", categoryColor(restaurant.category));
      }
      pin.addEventListener("mouseenter", () => {
        if (popupRef.current?.isOpen()) {
          closeHoverPopup();
          return;
        }
        closeHoverPopup();
        const hoverPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "restaurant-tip",
          offset: 16,
        })
          .setLngLat([restaurant.lng, restaurant.lat])
          .setDOMContent(tooltipContent(restaurant, locale))
          .addTo(map);
        hoverPopupRef.current = hoverPopup;
        const hoverElement = hoverPopup.getElement();
        hoverElement?.addEventListener("mouseenter", cancelHoverClose);
        hoverElement?.addEventListener("mouseleave", scheduleHoverClose);
      });
      pin.addEventListener("mouseleave", scheduleHoverClose);
      pin.addEventListener("click", (event) => {
        event.stopPropagation();
        closeHoverPopup();
        onSelectRef.current(restaurant.id);
      });

      const marker = new mapboxgl.Marker({ element: pin, anchor: "center" })
        .setLngLat([restaurant.lng, restaurant.lat])
        .addTo(map);
      markersRef.current.set(restaurant.id, marker);
    }

    return () => {
      closeHoverPopup();
      for (const marker of markersRef.current.values()) marker.remove();
      markersRef.current.clear();
    };
  }, [locale, ready, restaurants]);

  useEffect(() => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup || !ready) return;

    for (const [id, marker] of markersRef.current) {
      marker.getElement().classList.toggle("gpin-selected", id === selectedId);
    }

    if (selectedId) {
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
        hoverCloseTimerRef.current = null;
      }
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
    }

    const selected = restaurants.find((restaurant) => restaurant.id === selectedId);
    if (!selected) {
      if (popup.isOpen()) popup.remove();
      return;
    }

    map.flyTo({
      center: [selected.lng, selected.lat],
      zoom: Math.max(map.getZoom(), 15),
      essential: true,
    });
    popup
      .setLngLat([selected.lng, selected.lat])
      .setDOMContent(popupContent(selected, locale, messages))
      .addTo(map);
  }, [locale, messages, ready, restaurants, selectedId]);

  const fitAll = () => {
    const map = mapRef.current;
    if (!map || restaurants.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    for (const restaurant of restaurants) {
      bounds.extend([restaurant.lng, restaurant.lat]);
    }
    map.fitBounds(bounds, { padding: 48, maxZoom: 15 });
  };

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" />
      {!ready && (
        <div className="map-loading map-loading-overlay" role="status">
          {error ? messages.mapError : messages.mapLoading}
        </div>
      )}
      {ready && (
        <div className="map-actions">
          <button
            type="button"
            onClick={() =>
              mapRef.current?.flyTo({ center: TOKYO_CENTER, zoom: 10.5, essential: true })
            }
          >
            {messages.mapTokyo}
          </button>
          <button type="button" onClick={fitAll}>
            {messages.mapFitAll}
          </button>
        </div>
      )}
    </div>
  );
}

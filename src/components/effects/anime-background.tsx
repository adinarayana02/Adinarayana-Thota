"use client";

import { useEffect, useRef } from "react";

export function AnimeBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      rootRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`);
      rootRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div ref={rootRef} className="spatial-background" aria-hidden="true">
      <div className="spatial-background__aurora" />
      <div className="spatial-background__pointer" />
      <div className="spatial-background__grid" />
      <div className="spatial-background__orb spatial-background__orb--one" />
      <div className="spatial-background__orb spatial-background__orb--two" />
      <div className="spatial-background__noise" />
    </div>
  );
}

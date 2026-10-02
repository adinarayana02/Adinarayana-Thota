/* eslint-disable @next/next/no-img-element */
"use client";

import { Code2 } from "lucide-react";

interface ProjectPreviewVisualProps {
  image?: string;
  title: string;
  label?: string;
  className?: string;
}

export function ProjectPreviewVisual({
  image,
  title,
  label,
  className = "",
}: ProjectPreviewVisualProps) {
  const hasRenderableImage = Boolean(image && !image.includes("duli_preview.png"));

  return (
    <div className={`project-visual ${className}`}>
      {hasRenderableImage ? (
        <img
          src={image}
          alt={`${title} interface preview`}
          className="absolute inset-0 h-full w-full object-cover object-top"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.remove();
          }}
        />
      ) : null}
      <div className="project-visual__fallback">
        <Code2 className="mb-3 h-8 w-8 text-primary/70" aria-hidden="true" />
        {label ? <span>{label}</span> : null}
        <strong>{title}</strong>
      </div>
      <div className="project-visual__chrome">
        <span />
        <span />
        <span />
        <small>adinarayana.dev / {title.toLowerCase().replace(/\s+/g, "-")}</small>
      </div>
    </div>
  );
}

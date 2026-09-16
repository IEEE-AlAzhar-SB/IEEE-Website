const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const BASE = CLOUD_NAME
  ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
  : null;

interface CloudinaryImageProps {
  publicId: string;
  sizes: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Reject path traversal / URL smuggling in Cloudinary public IDs. */
function toSafePublicId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > 200) return null;
  if (
    id.includes("..") ||
    id.includes(",") ||
    id.includes("http") ||
    id.includes("data:") ||
    id.includes("javascript:") ||
    /[\s<>"'`\\]/.test(id) ||
    id.startsWith("/") ||
    /\/\//.test(id)
  ) {
    return null;
  }
  return encodeURIComponent(id);
}

const CloudinaryImage = ({
  publicId,
  sizes,
  alt,
  className,
  eager,
}: CloudinaryImageProps) => {
  // Cards render at max ~450px wide; 800w covers 2x DPR. Dropping the
  // 1600w variant avoids downloading ~2-4x bytes for no visible gain.
  const widths = [400, 600, 800, 1200];

  // Fail closed: no cloud name or unsafe public ID renders nothing rather
  // than a broken `undefined` URL or an attacker-controlled path.
  const safeId = toSafePublicId(publicId);
  if (!BASE || !safeId) return null;

  const buildUrl = (w: number) =>
    `${BASE}/f_auto,q_auto,w_${w}/${safeId}`;

  const srcSet = widths.map((w) => `${buildUrl(w)} ${w}w`).join(", ");

  return (
    <img
      src={buildUrl(800)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
};

export default CloudinaryImage;

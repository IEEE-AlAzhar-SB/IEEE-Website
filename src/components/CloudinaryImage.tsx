const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

interface CloudinaryImageProps {
  publicId: string;
  sizes: string;
  alt: string;
  className?: string;
  eager?: boolean;
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

  const buildUrl = (w: number) =>
    `${BASE}/f_auto,q_auto,w_${w}/${publicId}`;

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

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
  const widths = [400, 600, 800, 1200, 1600];

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
      decoding="async"
      className={className}
    />
  );
};

export default CloudinaryImage;

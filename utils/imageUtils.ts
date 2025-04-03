import { IMAGE_BASE_URL, IMAGE_SIZES } from "@/constants/Config";

type ImageType = "poster" | "backdrop";
type ImageSize = "small" | "medium" | "large" | "original";

export const getImageUrl = (
  path: string | null,
  type: ImageType = "poster",
  size: ImageSize = "medium"
): string => {
  if (!path) {
    return "";
  }

  const sizeValue = IMAGE_SIZES[type][size];
  return `${IMAGE_BASE_URL}/${sizeValue}${path}`;
};

export const getPlaceholderImage = (type: ImageType = "poster"): string => {
  return type === "poster"
    ? "https://placehold.co/185x278/png"
    : "https://placehold.co/500x281/png";
};

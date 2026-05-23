import apartmentImage from '@/assets/bio/standing-in-an-apartment.png';

type ApartmentPanoramaViewerProps = {
  className?: string;
};

export function ApartmentPanoramaViewer({
  className = '',
}: ApartmentPanoramaViewerProps) {
  return (
    <figure className={`apartment-panorama ${className}`.trim()}>
      <img
        src={apartmentImage}
        alt="Cyberpunk apartment interior in Addis Ababa"
        className="apartment-panorama__image"
        draggable={false}
      />
    </figure>
  );
}

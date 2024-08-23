import { StationResponseItem } from '@admin/models/station.model';
import { StationFormData } from '@admin/models/station-form.model';

export const mapFromIdToStation = (
  { id }: { id: number },
  { city, latitude, longitude, relations }: StationFormData,
): StationResponseItem => {
  return {
    id,
    city,
    latitude,
    longitude,
    connectedTo: relations.map((id) => ({ id })),
  };
};

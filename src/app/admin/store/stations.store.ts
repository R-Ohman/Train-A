import { computed, inject } from '@angular/core';
import { signalStore, type, patchState, withMethods, withComputed } from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  removeEntity,
  addEntity,
  entityConfig,
} from '@ngrx/signals/entities';
import { AdminService } from '@admin/services/admin.service';
import { StationResponseItem } from './../models/station.model';
import { StationFormData } from '@admin/models/station-form.model';

export const stationConfig = entityConfig({
  entity: type<StationResponseItem>(),
  collection: 'stations',
  selectId: (station) => station.id,
});

export const StationStore = signalStore(
  { providedIn: 'root' },
  withEntities(stationConfig),

  withMethods((store, adminService = inject(AdminService)) => ({
    async getStations(): Promise<void> {
      if (store.stationsEntities.length > 0) {
        return;
      }
      const stations = await adminService.getStations();
      patchState(store, setAllEntities(stations, stationConfig));
    },

    async deleteStation(id: number): Promise<void> {
      await adminService.deleteStation(id);
      patchState(store, removeEntity(id, stationConfig));
    },

    async addStation(body: StationFormData): Promise<void> {
      const station = await adminService.postStation(body);
      patchState(store, addEntity(station, stationConfig));
    },
  })),

  withComputed(({ stationsEntities }) => ({
    locations: computed(() =>
      stationsEntities().map(({ city, latitude, longitude }) => ({
        location: [latitude, longitude],
        label: city,
      })),
    ),
  })),
);

export type StationStore = InstanceType<typeof StationStore>;

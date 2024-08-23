import { StationResponseItem } from '@admin/models/station.model';
import { StationStore } from '@admin/store/stations/stations.store';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteManagementService {
  private stationStore = inject(StationStore);

  getStationsByIds(stationIds: number[]): StationResponseItem[] {
    const stationsMap = this.stationStore.stationsEntityMap();
    return stationIds.map((id) => stationsMap[id]);
  }

  getConnectedStations(stationId: number): StationResponseItem[] {
    const stations = this.stationStore.stationsEntityMap();
    const fromStation = stations[stationId];

    const connectedStations = fromStation.connectedTo.map(
      (connection) => stations[connection.id],
    );
    return connectedStations;
  }

  getStationCities(stationIds: number[]): string[] {
    const stations = this.getStationsByIds(stationIds);
    return stations.map((station) => station?.city);
  }
}

import { StationStore } from '@admin/store/stations/stations.store';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectionList } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Carriage } from '@shared/models/interfaces/carriage.model';
import { CarriageStore } from '@shared/store/carriages.store';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectionList,
    MatSelectModule,
    MatButton,
    ReactiveFormsModule,
    MatIcon,
    MatFabButton,
  ],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
})
export class RouteFormComponent implements OnInit {
  routeId = input<number>(); // TODO: update form
  closeForm = output<boolean>();
  routeForm!: FormGroup;
  carriageTypes = signal<Partial<Carriage>[]>([]);

  connectedStationsMap = computed(() => {
    const stations = this.stationStore.stationsEntities();
    const stationsMap = this.stationStore.stationsEntityMap();

    return (stationId: number) => {
      if (!stationId) {
        return stations;
      }
      const fromStation = stations[stationId];
      const connectedStations = fromStation.connectedTo.map(
        (connection) => stationsMap[connection.id],
      );
      return connectedStations;
    };
  });

  private carriageStore = inject(CarriageStore);
  private stationStore = inject(StationStore);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.routeForm = this.formBuilder.group({
      stations: this.formBuilder.array([this.createFormControl()], this.minArrayLength(3)),
      carriages: this.formBuilder.array([this.createFormControl()], this.minArrayLength(3)),
    });
    this.initCarriageTypes();
  }

  onSubmit() {
    this.enableFormArrays();
    console.log('Submitted', this.routeForm.value);
    this.onReset();
  }

  onReset() {
    this.enableFormArrays();
    this.routeForm.reset();
    this.stations.clear();
    this.carriages.clear();
    this.stations.push(this.createFormControl());
    this.carriages.push(this.createFormControl());
  }

  onClose() {
    this.closeForm.emit(true);
  }

  onSetStation(idx: number) {
    const stationsNum = this.stations.length - 1;
    const isLast = idx === stationsNum;
    if (!isLast) return;

    if (stationsNum) {
      this.stations.at(stationsNum - 1).disable();
    }
    this.stations.push(this.createFormControl());
  }

  onSetCarriage(idx: number) {
    const carriagesNum = this.carriages.length - 1;
    const isLast = idx === carriagesNum;
    if (!isLast) return;

    this.carriages.push(this.createFormControl());
  }

  onDeleteStation(event: Event, idx: number) {
    event.stopPropagation();
    this.stations.removeAt(idx);
    this.stations.at(idx - 1).enable();
  }

  onDeleteCarriage(event: Event, idx: number) {
    event.stopPropagation();
    this.carriages.removeAt(idx);
  }

  get stations() {
    return this.routeForm.get('stations') as FormArray;
  }

  get carriages() {
    return this.routeForm.get('carriages') as FormArray;
  }

  private initCarriageTypes() {
    this.carriageStore.getCarriages().then((carriages) => {
      this.carriageTypes.set(carriages());
    });
  }

  private createFormControl() {
    return this.formBuilder.control('');
  }

  private minArrayLength(min: number) {
    // the last value is always empty, so check min + 1
    const minRequiredLength = min + 1;
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= minRequiredLength
          ? null
          : { minArrayLength: { requiredLength: minRequiredLength, actualLength: control.length } };
      }
      return null;
    };
  }

  private enableFormArrays() {
    this.stations.enable();
    this.carriages.enable();
  }
}

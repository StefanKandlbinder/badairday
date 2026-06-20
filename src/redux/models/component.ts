import { AirComponent } from '../../types';

export default function createComponent(type = '', value = 0, unit = '', update = true): AirComponent {
  return { type, value: Number(value.toFixed(2)), unit, update };
}

const DATA_NORMALIZED = 'DATA_NORMALIZED';

export const dataNormalized = ({ feature }: { feature: string }) => ({
  type: `${feature} ${DATA_NORMALIZED}`,
  meta: { feature },
});

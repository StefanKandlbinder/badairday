import getDateFromTo from './GetDateFromTo';

export default function getUpperAustriaURL(url: string): string {
  const { from, to } = getDateFromTo();
  return url + 'datvon=' + from.replace(' ', '%20') + '&datbis=' + to.replace(' ', '%20');
}

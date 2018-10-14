import GetDateFromTo from './GetDateFromTo';

export default function getUpperAustriaURL(url) {
    let stringDateFrom = "";
    let stringDateTo = "";

    const getDateFromTo = new GetDateFromTo();

    stringDateFrom = getDateFromTo.stringDateFrom();
    stringDateTo = getDateFromTo.stringDateTo();

    url = url + "datvon=" + stringDateFrom + "&datbis=" + stringDateTo;

    return url;
}
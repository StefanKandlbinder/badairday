export const SET_OPTION_REVERSEGEO = 'SET_OPTION_REVERSEGEO';
export const SET_OPTION_AUTOUPDATING = 'SET_OPTION_AUTOUPDATING';
export const SET_OPTION_RUNAWAYS = 'SET_OPTION_RUNAWAYS';
export const SET_OPTION_SORT = 'SET_OPTION_SORT';

interface OptionInput { state: boolean; feature: string }

export const setOptionReverseGeo = ({ state, feature }: OptionInput) => ({ type: `${feature} ${SET_OPTION_REVERSEGEO}`, payload: state, meta: { feature } });
export const setOptionAutoupdater = ({ state, feature }: OptionInput) => ({ type: `${feature} ${SET_OPTION_AUTOUPDATING}`, payload: state, meta: { feature } });
export const setOptionRunaways = ({ state, feature }: OptionInput) => ({ type: `${feature} ${SET_OPTION_RUNAWAYS}`, payload: state, meta: { feature } });
export const setOptionSort = ({ state, feature }: OptionInput) => ({ type: `${feature} ${SET_OPTION_SORT}`, payload: state, meta: { feature } });

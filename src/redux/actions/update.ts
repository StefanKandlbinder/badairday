export const SET_UPDATE = 'SET_UPDATE';

export const setUpdate = ({ update }: { update: number }) => ({
  type: SET_UPDATE,
  payload: update,
});

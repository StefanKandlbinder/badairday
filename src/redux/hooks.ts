import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../types';
import type { AppDispatch } from './store';

// Use these throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

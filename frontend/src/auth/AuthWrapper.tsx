import { ReactNode, useEffect } from 'react';

import { getMind } from '../actions/mindActions';
import { LOG_IN_SUCCEEDED, SIGN_UP_SUCCEEDED } from '../actions/userActions';
import { auth } from './firebase';
import { useAppDispatch } from '../store';

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!!user) {
        const {
          email,
          metadata: { creationTime, lastSignInTime },
          refreshToken,
          uid: userId,
        } = user;

        if (creationTime === lastSignInTime) {
          dispatch(
            SIGN_UP_SUCCEEDED({
              userData: {
                email,
                userId,
                token: refreshToken,
              },
            })
          );
        } else {
          dispatch(
            LOG_IN_SUCCEEDED({
              userData: {
                email,
                userId,
                token: refreshToken,
              },
            })
          );
          dispatch(getMind({ userId }));
        }
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return <>{children}</>;
};

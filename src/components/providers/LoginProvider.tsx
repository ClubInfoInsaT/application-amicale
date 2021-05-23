import React, { useState } from 'react';
import { LoginContext, LoginContextType } from '../../context/loginContext';

type Props = {
  children: React.ReactChild;
  initialToken: string | undefined;
};

export default function LoginProvider(props: Props) {
  const setLogin = (token: string | undefined) => {
    setLoginState((prevState) => ({
      ...prevState,
      token,
    }));
  };

  const [loginState, setLoginState] = useState<LoginContextType>({
    token: props.initialToken,
    setLogin: setLogin,
  });

  return (
    <LoginContext.Provider value={loginState}>
      {props.children}
    </LoginContext.Provider>
  );
}

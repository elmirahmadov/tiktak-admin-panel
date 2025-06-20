import { PropsWithChildren } from 'react';

import { Button as ButtonAnt } from 'antd';

import styles from './button.module.css';

// interface Props extends ButtonProps {
//   variant?: "dark" | "primary" | 'danger' | 'default';
// }

function ButtonCustom({ children, variant, ...props }: PropsWithChildren<any>) {
  return (
    <ButtonAnt
      className={`${styles.button_custom} ${variant && styles[variant]}`}
      {...props}
    >
      {children}
    </ButtonAnt>
  );
}

export default ButtonCustom;

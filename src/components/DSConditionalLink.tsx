import React, { HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

interface ConditionalLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  to: string;
  disabled?: boolean;
  children: ReactNode;
}

const DSConditionalLink: React.FC<ConditionalLinkProps> = ({ to, disabled, children, ...rest }) => {
  return (
    disabled ? children : (
      <Link href={to} {...rest}>{children}</Link>
    )
  );
};

export default DSConditionalLink;
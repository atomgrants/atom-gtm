import { LucideIcon } from 'lucide-react';
import type { ComponentClass, FunctionComponent } from 'react';
import * as React from 'react';
import { IconBaseProps, IconType } from 'react-icons';

export type IconComponent = LucideIcon | IconType;

type IconProps = IconBaseProps & {
  size?: string | number;
  className?: string;
};

export function renderIcon(Icon: IconComponent, props: IconProps) {
  // Check if it's a Lucide icon by looking for the 'displayName' property
  const isLucideIcon = !!(Icon as LucideIcon).displayName;

  if (isLucideIcon) {
    return React.createElement(Icon as LucideIcon, props);
  } else {
    // Cast IconType to the correct React component type
    const ReactIcon = Icon as
      | FunctionComponent<IconBaseProps>
      | ComponentClass<IconBaseProps>;
    return React.createElement(ReactIcon, props);
  }
}

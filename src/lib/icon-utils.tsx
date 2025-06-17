import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';

export type IconComponent = LucideIcon | IconType;

export function renderIcon(Icon: IconComponent, props: { size?: string | number; className?: string }) {
  // Check if it's a Lucide icon by looking for the 'displayName' property
  const isLucideIcon = !!(Icon as LucideIcon).displayName;

  if (isLucideIcon) {
    return React.createElement(Icon as LucideIcon, props);
  } else {
    return React.createElement(Icon as IconType, props);
  }
} 
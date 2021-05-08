import React from 'react';
import TabHomeIcon from './TabHomeIcon';
import TabSideIcon from './TabSideIcon';

interface Props {
  isMiddle: boolean;
  focused: boolean;
  label: string | undefined;
  icon: string;
  focusedIcon: string;
  onPress: () => void;
}

function TabIcon(props: Props) {
  if (props.isMiddle) {
    return (
      <TabHomeIcon
        icon={props.icon}
        focusedIcon={props.focusedIcon}
        focused={props.focused}
        onPress={props.onPress}
      />
    );
  } else {
    return (
      <TabSideIcon
        focused={props.focused}
        label={props.label}
        icon={props.icon}
        focusedIcon={props.focusedIcon}
        onPress={props.onPress}
      />
    );
  }
}

function areEqual(prevProps: Props, nextProps: Props) {
  return prevProps.focused === nextProps.focused;
}

export default React.memo(TabIcon, areEqual);

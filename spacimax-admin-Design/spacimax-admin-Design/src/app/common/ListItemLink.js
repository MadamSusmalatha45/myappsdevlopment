import React, { useMemo } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function ListItemLink(props) {
  // eslint-disable-next-line react/prop-types
  const { icon, primary, to } = props;

  const renderLink = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      React.forwardRef(function Link(itemProps, ref) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to]
  );

  return (
    <li>
      <ListItemButton component={renderLink} pt={1}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText sx={{ fontWeight: "500" }} primary={primary} />
      </ListItemButton>
    </li>
  );
}

export default ListItemLink;

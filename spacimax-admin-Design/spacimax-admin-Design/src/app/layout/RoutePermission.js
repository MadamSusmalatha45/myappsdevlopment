import {useEffect} from 'react'
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function RoutePermission({ children, permission }) {
  const location = useLocation();
  const permissions = JSON.parse(localStorage.getItem('permissions'))
  const check = permissions.filter((item) => item.name == permission)

  useEffect(() => {
  },[permissions, permission])

  return check.length > 0 ? (
    <>
        {children}
    </>
  ) : (
    
    <Navigate to="/permission" replace state={{ path: location.pathname }} />
  );
}

export default RoutePermission;

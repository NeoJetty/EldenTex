// libs
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// project
import { logout } from "../../redux/slices/authSlice";

const reCheckInterval = 5 * 60 * 1000; // 5 min

const LoggedInHeartbeat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const now = Date.now();
      const lastChecked = localStorage.getItem("lastCheckedIfLoggedIn");

      if (lastChecked && now - parseInt(lastChecked) < reCheckInterval - 2000) {
        return;
      }

      try {
        const response = await fetch("/api/loggedInCheck");
        if (response.status === 200) {
          localStorage.setItem("lastCheckedIfLoggedIn", now.toString());
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, reCheckInterval);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null; // No UI
};

export default LoggedInHeartbeat;

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// a helper component to force a page refresh even tough the params did not change
// dismounts a page, mounts this one and then re-mounts the previous page again
const ForceRemount = () => {
  const navigate = useNavigate();
  const { path } = useParams(); // Capture dynamic path

  useEffect(() => {
    navigate(`/${path}`, { replace: true }); // Redirect instantly
  }, [navigate, path]);

  return null; // No UI needed
};

export default ForceRemount;

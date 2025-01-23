import React, { useState } from "react";
import { Button } from "@mui/material";
import RelatedMapsDisplay from "../../RelatedMapsDisplay";

const HoverButtonWithPopover: React.FC<{ texture_id: number }> = ({
  texture_id,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY + 5, // Position below the button
        left: rect.left + window.scrollX,
      });
    }
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Map
      </Button>

      {/* Show the popover on hover */}
      {showPopover && (
        <div
          style={{
            position: "absolute",
            top: popoverPosition.top,
            left: popoverPosition.left,
            zIndex: 10,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <RelatedMapsDisplay texture_id={texture_id} />
        </div>
      )}
    </div>
  );
};

export default HoverButtonWithPopover;

import React, { useState } from "react";

export enum ToggleState {
  ON = "on",
  OFF = "off",
  NEUTRAL = "neutral",
}

interface ToggleProps {
  tagID: number;
  textureID: number;
  name: string;
  initialState: ToggleState;
  onChange: (newState: ToggleState) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  tagID,
  textureID,
  name,
  initialState,
  onChange,
}) => {
  const [state, setState] = useState<ToggleState>(initialState);

  const handleToggleClick = () => {
    const newState =
      state === ToggleState.ON
        ? ToggleState.OFF
        : state === ToggleState.OFF
        ? ToggleState.NEUTRAL
        : ToggleState.ON;

    setState(newState);
    onChange(newState); // Notify the parent about the state change
  };

  const getImageForState = (state: ToggleState): string => {
    switch (state) {
      case ToggleState.ON:
        return "UXimg/toggle_on.png";
      case ToggleState.OFF:
        return "UXimg/toggle_off.png";
      case ToggleState.NEUTRAL:
      default:
        return "UXimg/toggle_neutral.png";
    }
  };

  return (
    <div className="tag-toggle-container">
      <div
        className="tag-toggle"
        data-tag-id={tagID}
        onClick={handleToggleClick}
      >
        <img
          className="toggle-image"
          src={getImageForState(state)}
          alt={`${name} toggle`}
        />
      </div>
      <label>{name}</label>
    </div>
  );
};

export default Toggle;

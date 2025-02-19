import React from "react";

export enum ToggleState {
  ON = "on",
  OFF = "off",
  NEUTRAL = "neutral",
}

interface ToggleProps {
  name: string;
  state: ToggleState;
  onChange: (newState: ToggleState) => void; // curried version of the callback
}

const Toggle: React.FC<ToggleProps> = ({ name, state, onChange }) => {
  const handleToggleClick = () => {
    const newState =
      state === ToggleState.ON
        ? ToggleState.OFF
        : state === ToggleState.OFF
        ? ToggleState.NEUTRAL
        : ToggleState.ON;

    onChange(newState); // Notify the parent about the state change
  };

  const getImageForState = (state: ToggleState): string => {
    switch (state) {
      case ToggleState.ON:
        return "/UXimg/toggle_on.png";
      case ToggleState.OFF:
        return "/UXimg/toggle_off.png";
      case ToggleState.NEUTRAL:
      default:
        return "/UXimg/toggle_neutral.png";
    }
  };

  return (
    <div className="tag-toggle-container">
      <div className="tag-toggle" onClick={handleToggleClick}>
        <img
          className="toggle-image"
          src={getImageForState(state)}
          alt={`${name} toggle`}
        />
      </div>
      <label style={{ fontSize: "16px" }}>{name}</label>
    </div>
  );
};

export default Toggle;

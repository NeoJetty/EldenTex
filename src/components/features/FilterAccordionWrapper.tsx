import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Toggle, { ToggleState } from "../shared/Toogle";
import { NamedStateTag } from "../../redux/slices/tagManagmentSlice";

interface FilterAccordionWrapperProps {
  category: string;
  tags: NamedStateTag[]; // Change to NamedStateTag[] directly
  onTagChange: (id: number, state: ToggleState) => void;
}

const FilterAccordionWrapper: React.FC<FilterAccordionWrapperProps> = ({
  category,
  tags,
  onTagChange, // Rename to onTagChange to be more descriptive
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {tags.map((tag) => (
          <Toggle
            key={tag.id}
            name={tag.name}
            state={tag.state ?? ToggleState.NEUTRAL}
            onChange={(newState) => onTagChange(tag.id, newState)} // Pass directly to the onTagChange prop
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordionWrapper;

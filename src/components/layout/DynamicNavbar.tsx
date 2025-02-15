import { useSelector, useDispatch } from "react-redux";
import { StoreTypes } from "../../redux/store";
import { Tab, Box } from "@mui/material";
import { clearFilter, showFilterModal } from "../../redux/slices/filterSlice";
import { Close } from "@mui/icons-material";

const DynamicNavbar: React.FC = () => {
  const dispatch = useDispatch();

  const isFilterActive = useSelector(
    (state: StoreTypes) => state.filter.tags.length > 0
  );

  return (
    <>
      {isFilterActive && (
        <Tab
          sx={{
            margin: 0,
            padding: "4px 8px",
            minHeight: "32px",
          }}
          label="Filter"
          value="Filter"
          onClick={() => dispatch(showFilterModal())}
          icon={
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "2px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(clearFilter());
              }}
            >
              <Close fontSize="small" />
            </Box>
          }
          iconPosition="end"
        />
      )}
    </>
  );
};

export default DynamicNavbar;

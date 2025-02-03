import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import * as API from "../../api/slices.api";

interface SliceSearchProps {
  fetchSlices: (sliceName: string, confidenceThreshold: number) => void;
}

const SliceSearch: React.FC<SliceSearchProps> = ({ fetchSlices }) => {
  const [selectedTagID, setSelectedTagID] = useState<number>(3); // Default tagID
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tags = useSelector((state: StoreTypes) => state.tagManagement.allTags);

  // Handle the change of selected tag in dropdown
  const handleTagChange = (event: SelectChangeEvent<number>) => {
    setSelectedTagID(event.target.value as number);
  };

  // Fetch autocomplete suggestions on search input change
  useEffect(() => {
    if (searchInput.trim()) {
      setIsLoading(true);
      API.getSymbolNamesAutocomplete(searchInput).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  const handleLiveSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    // Show suggestions only when typing
    if (e.target.value.trim()) {
      API.getSymbolNamesAutocomplete(e.target.value).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setSuggestions([]); // Hide the suggestions after clicking
    // Fetch slices when a suggestion is clicked
    fetchSlices(suggestion, 0.5); // Example confidenceThreshold = 0.5
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSlices(searchInput, 0.5); // Fetch slices on form submit
  };

  return (
    <Box>
      {/* Dropdown for selecting a tag */}
      <FormControl style={{ width: "20%" }} margin="normal">
        <InputLabel>Tag</InputLabel>
        <Select
          value={selectedTagID}
          onChange={handleTagChange}
          label="Single Tag"
        >
          {tags.length === 0 ? (
            <MenuItem disabled>Loading...</MenuItem> // Show loading if tags are being fetched
          ) : (
            tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* Autocomplete-enabled text field */}
      <form onSubmit={handleSearchSubmit}>
        <TextField
          label="Search"
          type="text"
          value={searchInput}
          onChange={handleLiveSearchChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: isLoading ? <CircularProgress size={20} /> : null,
          }}
        />

        {/* Autocomplete suggestions dropdown */}
        {suggestions.length > 0 && (
          <Paper elevation={3} style={{ position: "absolute", zIndex: 1 }}>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ListItemButton>
                    <ListItemText primary={suggestion} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </form>
    </Box>
  );
};

export default SliceSearch;

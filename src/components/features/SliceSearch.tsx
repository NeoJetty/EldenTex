// MUI
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
// libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// project
import { StoreTypes } from "../../redux/store";
import * as API from "../../api/symbols.api";

interface SliceSearchProps {
  fetchSlices: (sliceName: string, confidenceThreshold: number) => void;
}

const SliceSearch: React.FC<SliceSearchProps> = ({ fetchSlices }) => {
  const [selectedTagID, setSelectedTagID] = useState<number>(3);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tags = useSelector((state: StoreTypes) => state.tagManagement.allTags);

  const handleTagChange = (event: SelectChangeEvent<number>) => {
    setSelectedTagID(event.target.value as number);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    API.getSymbolNamesAutocomplete(searchInput).then((results) => {
      setSuggestions(results);
      setIsLoading(false);
    });
  }, [searchInput]);

  const handleLiveSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    fetchSlices(suggestion, 0.5);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSlices(searchInput, 0.5);
  };

  return (
    <Box>
      <FormControl style={{ width: "20%" }} margin="normal">
        <InputLabel>Tag</InputLabel>
        <Select
          value={selectedTagID}
          onChange={handleTagChange}
          label="Single Tag"
        >
          {tags.length === 0 ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
        <TextField
          label="Search"
          type="text"
          value={searchInput}
          onChange={handleLiveSearchChange}
          fullWidth
          margin="normal"
          autoComplete="off"
          InputProps={{
            endAdornment: isLoading ? <CircularProgress size={20} /> : null,
          }}
        />

        {suggestions.length > 0 && (
          <Paper
            elevation={3}
            style={{ position: "absolute", zIndex: 1, width: "100%" }}
          >
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

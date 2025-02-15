import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import FilterDialog from "./FilterDialog";

const ModalManager: React.FC = () => {
  const isFilterModalVisible = useSelector(
    (state: StoreTypes) => state.filter.isFilterModalVisible
  );

  return <>{isFilterModalVisible && <FilterDialog />}</>;
};

export default ModalManager;

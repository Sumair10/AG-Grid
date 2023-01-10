import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";

const SimpleComp = (p) => {
  const onAt = useCallback(() => window.alert("At " + p.value));

  return (
    <>
      <button onClick={onAt}>{p.buttonText}</button>
      {p.value}
    </>
  );
};

const ComplexComp = (p) => {
  const onHash = useCallback(() => window.alert("Hash " + p.value));

  return (
    <>
      <button onClick={onHash}>{p.buttonText}</button>
      {p.value}
    </>
  );
};
const AgGrid1 = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      cellRenderer: SimpleComp,
      cellRendererParams: {
        buttonText: "=",
      },
    },
    {
      field: "age",
      cellRenderer: SimpleComp,
      cellRendererParams: {
        buttonText: "#",
      },
    },
    { field: "country" , cellRenderer : p => <> <b>Country is : </b> {p.value} </> },
    { field: "year" , cellRendererSelector : p => {
      if (p.value > 2000){
        return {component : ComplexComp , params : {
          buttonText: "+"
        }}
      }
    
    } },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    enableRowGroup: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from sever
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div>
      {/* Example using Grid's API */}
      <button onClick={buttonListener}>Push Me</button>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className="ag-theme-alpine"
        style={{ width: "100vw", height: "80vh" }}
      >
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          rowGroupPanelShow="always"
        />
      </div>
    </div>
  );
};

export default AgGrid1;

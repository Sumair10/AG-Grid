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

const AgGrid6 = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country" , filter :'agMultiColumnFilter' },
    { field: "year" , filter : 'agSetColumnFilter' },
    {
      field: "date",
      filter: "agDateColumnFilter",
      // filterParams: {
      //   comparator: (dateFromFilter, cellValue) => {
      //     if (cellValue == null) {
      //       return 0;
      //     }

      //     const dateParts = cellValue.split("/");
      //     const day = Number(dateParts[0]);
      //     const month = Number(dateParts[1]) - 1;
      //     const year = Number(dateParts[2]);
      //     const cellDate = new Date(year, month, day);

      //     if (cellDate < dateFromFilter) {
      //       return -1;
      //     } else if (cellDate > dateFromFilter) {
      //       return 1;
      //     }
      //     return 0;
      //   },
      // },
    },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  //  const [columnDefs, setColumnDefs] = useState([

  //   {field: 'athlete', filter : 'agTextColumnFilter'},
  //   {field: 'age' , filter : 'agNumberColumnFilter'},
  //   {field: 'country'},
  //   {field: 'year'},
  //   {field: 'date' , filter : 'agDateColumnFilter'},
  //   {field: 'sport'},
  //   {field: 'gold'},
  //   {field: 'silver'},
  //   {field: 'bronze'},
  //   {field: 'total'},
  //  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    floatingFilter : true ,
    // filterParams: {
    //   debounceMs: 0,
    //   buttons : ['apply', 'clear' , 'cancel' , 'reset']
    // },
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

  const savedFilterState = useRef();

  const onBtnSave = useCallback(() => {
    const filterModel = gridRef.current.api.getFilterModel();
    console.log("Saving filter model", filterModel);
    savedFilterState.current = filterModel;
  }, []);

  const onBtnApply = useCallback(() => {
    const filterModel = savedFilterState.current;
    console.log("applying filter model", filterModel);
    gridRef.current.api.setFilterModel(filterModel);
  }, []);

  return (
    <div>
      <div>
        <button onClick={onBtnSave}>Save</button>
        <button onClick={onBtnApply}>Apply</button>
      </div>
      {/* Example using Grid's API */}
      {/* <button onClick={buttonListener}>Push Me</button> */}

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className="ag-theme-alpine"
        style={{ width: "100vw", height: "80vh" }}
      >
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          // columnDefs={columnDefs} // Column Defs for Columns
          // defaultColDef={defaultColDef} // Default Column Properties
          // popupParent={document.body}

          //  animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          //  rowSelection='multiple' // Options - allows click selection of rows

          //  onCellClicked={cellClickedListener} // Optional - registering for Grid Event

          //  rowGroupPanelShow='always'
        />
      </div>
    </div>
  );
};

export default AgGrid6;

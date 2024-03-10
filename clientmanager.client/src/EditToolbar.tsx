import { Button } from "@mui/material";
import { GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

export type EditToolbarProps = {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

export function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const [counter, setCounter] = useState(-1);

    const handleClick = () => {
        setRows((oldRows) => [{ clientId: counter, firstName: 'NaN', lastName: 'NaN', isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [counter]: { mode: GridRowModes.Edit },
        }));
        setCounter(prevValue => prevValue - 1);
    };

    return (
        <GridToolbarContainer>
            <GridToolbarQuickFilter />
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}
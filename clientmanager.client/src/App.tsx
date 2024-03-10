import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridRowsProp, GridColDef, GridRowModesModel, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModel, GridActionsCellItem, GridPreProcessEditCellProps } from '@mui/x-data-grid';
import './index.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { EditToolbar } from './EditToolbar';
import { format, isValid } from 'date-fns';
import { renderEditName } from './StyledToolTip';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE;

function renderDate(date) {
    if (!date || !isValid(new Date(date))) {
        return format(new Date(), 'yyyy/MM/dd');
    }
    return format(new Date(date), 'yyyy/MM/dd');
}

function App() {
    const preProcessRequired = (params: GridPreProcessEditCellProps) => {
        const errorMessage = params.props.value.length < 1 && "Value is required";
        return { ...params.props, error: errorMessage };
    };

    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="error"
                    />,
                ];
            },
        },
        {
            field: 'firstName', headerName: 'First Name', width: 150, editable: true,
            preProcessEditCellProps: preProcessRequired,
            renderEditCell: renderEditName,
        },
        {
            field: 'lastName', headerName: 'Last Name', width: 150, editable: true,
            preProcessEditCellProps: preProcessRequired,
            renderEditCell: renderEditName,
        },
        { field: 'email', headerName: 'Email', width: 250, editable: true },
        { field: 'phone', headerName: 'Phone', width: 150, editable: true },
        { field: 'companyName', headerName: 'Company Name', width: 200, editable: true },
        { field: 'clientType', headerName: 'Client Type', width: 150, editable: true, type: 'singleSelect', valueOptions: ['Individual', 'Corporate'], },
        {
            field: 'registrationDate', headerName: 'Registration Date', width: 200, editable: true, type: "dateTime",
            valueGetter: (params) => new Date(params.value),
            renderCell: (params) => renderDate(params.value),
        },
        { field: 'status', headerName: 'Status', width: 150, editable: true, type: 'singleSelect', valueOptions: ['New', 'Active', 'Inactive'], },
        { field: 'notes', headerName: 'Notes', width: 200, editable: true },
    ];


    useEffect(() => {
        onGetAllRequest();
    }, []);

    const onGetAllRequest = () => {
        axios.get<GridRowsProp[]>('/api/client/getAll')
            .then(response => {
                setRows(response.data);
                toast.success("All cliens fetched");
            })
            .catch(() => {
                toast.error("Error fetching clients");
            });
    }

    const onDeleteRequest = (id: number) => {
        axios.delete(`/api/client/delete/${id}`)
            .then(() => {
                toast.success("Successfully deleted");
            })
            .catch(() => {
                toast.error("Error delete client");
            });
    }

    const onUpdateRequest = (newRow: GridRowModel) => {
        axios.put(`/api/client/update/`, newRow)
            .then(() => {
                toast.success("Successfully updated");
            })
            .catch(() => {
                toast.error("Error update client");
            });
    }

    const onAddRequest = (newRow: GridRowModel) => {
        axios.post(`/api/client/add/`, { ...newRow, clientId: 0 })
            .then(() => {
                toast.success("Successfully added");
            })
            .catch(() => {
                toast.error("Error adding client");
            });
    }

    const [rows, setRows] = useState<GridRowsProp[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        onDeleteRequest(id);
        setRows(rows.filter((row) => row.clientId !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.clientId === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.clientId !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.clientId === newRow.clientId ? updatedRow : row)));

        newRow.clientId < 0 ? onAddRequest(newRow) : onUpdateRequest(newRow);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <div>
            <h2 className='w-full p-5'>The server stores information about customers of a certain trading organization. The client can perform the following operations: search, add, delete, edit data, sort by different fields. <br></br> <strong>&copy; Toroniy Serhiy (AMIm-13)</strong></h2>
            <DataGrid
                className="m-5"
                rows={rows}
                columns={columns}
                editMode="row"
                getRowId={(row) => row.clientId}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                    filter: {
                        filterModel: {
                            items: [],
                        },
                    },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                pageSizeOptions={[5, 10, 25]}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </div>
    );
}

export default App;
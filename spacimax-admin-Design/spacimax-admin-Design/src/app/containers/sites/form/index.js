import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Skeleton,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import Table from "@mui/material/Table";
import MenuItem from '@mui/material/MenuItem';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { TextField , FormControl,} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectSiteInspectionForm } from "../../../../features/sites/sitesSlice";
import {
  addQuestions,
  getSitesInspectionForm,
} from "../../../../features/sites/sitesAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { red } from "@mui/material/colors";

import "./style.css";
import Loader from "../../../common/Loader";
import { getAPI, postAPI } from "../../../network";
import { tableHeader,tableData } from "../../../utils";

export default function SiteFormPage() {
  // const dispatch = useDispatch();
  // const { loading, error, data } = useSelector(selectSiteInspectionForm);
  const { siteId, repId ,inspId} = useParams();
  const [loader, setLoader] = useState(false)
  const [forms, setForms] = useState([])
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState([]);
  const toastObj = { position: toast.POSITION.TOP_RIGHT };
  // console.log("ReportTypeId",inspId)
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      question: "",
      reportType:repId,
      siteId:siteId,
      inspectionId:inspId
    },
  });
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  

  const onSubmit = async(form) => {
    if (form.question === '' || form.question.length < 3) {
      toast.warning('Question is required! and at least 3 character long', toastObj)
      return;
    }
    console.log("--------------Form----------",form.question)
    setLoader(true)
    let data = await postAPI(`/report-questions`,form)
    if(data){
      handleClose();
      reset();
      getSitesInspectionForm()
    }
    // setLoader(false)
    // dispatch(addQuestions({ ...form, reportType: siteId }));
    // handleClose();
    // dispatch(getSitesInspectionForm({ reportType: siteId }));
    // reset();
  };

  useEffect(() => {
    getSitesInspectionForm()
    getReport()
    // dispatch(getSitesInspectionForm({ reportType: siteId, id: id }));
  }, []);

  const getReport = async() => {
    setLoader(true)
    const data = await getAPI('/reports');
    if(data){
        setReport(data)
    }

    setLoader(false)
  }

  const getSitesInspectionForm = async() => {
    setLoader(true)
    let data = await getAPI(`/report-questions?inspectionId=${inspId}`)
    if(data){ 
      var arr = [];
      for(var i = 0; i < data.length; i++){
        var obj = data[i];
        obj['choices'] = [
          { id: 1, name: "Yes", checked: false },
          { id: 2, name: "No", checked: false },
          { id: 3, name: "NA", checked: false },
        ];
        obj['note'] = '';
        arr.push(obj)
      }
      setForms(arr)
    }
    setLoader(false)
  }



  const changeChoice = (itemId, id) => {
    let output = forms.map((item) => {
      if(item.id === itemId){
        var choices = item.choices;
        var newChoices = [];
        for(var i =0 ; i < choices.length; i++){
          if(choices[i].id === id){
            newChoices.push({ id: choices[i].id, name: choices[i].name, checked: true })
          }
          else{
            newChoices.push({ id: choices[i].id, name: choices[i].name, checked: false })
          }
          
        }
        var newItem = item;
        newItem['choices'] = newChoices;
        return newItem;
        // return item;
      }
      else{
        return item;
      }
    })
    setForms(output)
  }


  const changeNote = (itemId, text) => {
    let output = forms.map((item) => {
      if(item.id === itemId){
        var newItem = item;
        newItem['note'] = text;
        return newItem;
      }
      else{
        return item;
      }  
    })
    setForms(output)
  }


 
  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader}/>
      <PageTitle
        title="Site View"
        subTitle=  "Create Form"
        headerTitle="Fire Alarm Report"
      />
      <Box
        Box
        display="flex"
        ml={4}
        flexDirection="column"
        rowGap={10}
        mb="20%"
      >
        
        <TableContainer component={Paper} sx={{ mx: "0.8rem" }}>
          {/* <div style={{width: 'auto', overflowX: 'scroll'}}> */}
          <Table
            sx={{ minWidth: "auto" }}
            aria-label="custom pagination table"
            className="responsive-table"
          >
            <TableHead>
              <TableRow className="table-header">
                <TableCell align="center" component="th" sx={{tableHeader, width:'50px !important'}}>
                  Que No.
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Enter Question
                </TableCell>
                <TableCell align="left" component="th" sx={tableHeader}>
                  Choices
                </TableCell>
                {/* <TableCell align="left" component="th" sx={tableHeader}>
                  Notes
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              
              {forms.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{tableData, width:'50px !important'}}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" sx={tableData}>
                    {item?.question}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={tableData}
                    style={{ width: "23%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      {item.choices.map((opt, ind) => (
                        <Button
                          variant="outlined"
                          onClick={() => {changeChoice(item.id,opt.id)}}
                          key={ind}
                          displayEmpty
                          className={
                            opt.checked ? "opt-button-active" : "opt-button"
                          }
                        
                        >
                          {opt.name}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                  {/* <TableCell align="left" sx={tableData}>
                    <TextField
                      id="outlined-basic"
                      label="Enter your Note"
                      variant="outlined"
                      size="small"
                      value={item.note}
                      onChange={(event) => {changeNote(item.id, event.target.value)}}
                    />
                  </TableCell> */}
                </TableRow>
              ))}
              <TableRow key="last">
                <TableCell
                  align="center"
                  component={Button}
                  sx={{
                    fontWeight: "500 !important",
                    py: 1,
                    ml: 1,
                    color: "#75859D !important",
                    tableData
                  }}
                  onClick={handleClickOpen}
                >
                 <span> Add
                  <AddCircleIcon className="add-icon" fontSize="medium" /></span>
                </TableCell>
               
                <TableCell align="left" sx={tableData}></TableCell>
                <TableCell align="left" sx={tableData}></TableCell>
                {/* <TableCell align="left" sx={tableData}></TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
          {/* </div> */}
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Question</DialogTitle>
          <DialogContent  sx={{width:'30rem'}}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name={"question"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Question"
                      variant="outlined"
                      type="text"
                      required
                      onChange={onChange}
                      value={value}
                      sx={{ borderColor: red[100] }}
                      error={!!errors.question}
                      helperText={
                        errors.question ? errors.question?.message : null
                      }
                    />
                  )}
                />  
              </Grid>
             
              {/* <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name={"type"}
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: 0,
                      message: "Minimum Value Is Zero",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Type"
                      variant="outlined"
                      type="number"
                      required
                      onChange={onChange}
                      value={value}
                      sx={{ borderColor: red[100] }}
                      error={!!errors.type}
                      helperText={errors.type ? errors.type?.message : null}
                    />
                  )}
                />
              </Grid> */}
              {/* <Grid item xs={7} justifyContent="center" display="flex">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Notes"
                      variant="outlined"
                      multiline   
                      rows={3}
                      onChange={onChange}
                      value={value}
                      error={!!errors.notes}
                      helperText={errors.notes ? errors.notes?.message : null}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              my={3}
              component="form"
            >
              <Grid item xs={7} justifyContent="space-around" display="flex">
                <Button
                  disabled={false}
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button disabled={false} onClick={handleSubmit(onSubmit)}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

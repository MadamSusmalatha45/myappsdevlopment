import React, {useEffect, useState} from "react";
import { Box, Grid } from "@mui/material";
import PageTitle from "../../common/PageTitle";
import FAQCard from "../../components/faq/FAQCard";
import Loader from "../../common/Loader";


export default function FAQPage() {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // setLoader(true)
    // setTimeout(setLoader(false), 3000);
  },[])


  const questions = [
    {
      id: 1,
      title: "Frequently Asked Questions",
      url : "/faq/frequently-asked-questions"
    },

    {
      id: 2,
      title: "Privacy Policy",
      url : "/faq/privacy-policy"
    },
    {
      id: 3,
      title: "Help Center",
      url : "/faq/user-guide"
    },
  ];


  
  return (
    <Box sx={{ height: "inherit" }}>
      <Loader loader={loader} />
      <PageTitle title="FAQ's" subTitle="Online Reference Documents" />
     
      <Box display="flex">
        <Grid
          container
          rowSpacing={7}
          columnSpacing={{ xs: 1 }}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          mt="1%"
        >
          {questions.map((report) => (
            <FAQCard large title={report.title} key={report.id} url={report.url}/>
          ))}
         
        </Grid>
      </Box>

    
    </Box>
  );
}

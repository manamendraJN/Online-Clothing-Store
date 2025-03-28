import React from 'react';
import ProductReviewCard from './productReviewCard';
import {Grid, LinearProgress,Rating,Box} from '@mui/material'


export default function ProductReview(){

    return(

        <section className="grid grid-cols-1  px-16 pt-10">
   
        <h1 className='font-semibold text-lg pb-4'>  Reviews and Ratings</h1>
         <div className="border p-5">
            <Grid container spacing={7}>

              <Grid item xs={7}>
                <div className="space-y-5"> 
               {[1,1,1].map((item)=> <ProductReviewCard/>)}
                </div>
              </Grid>

              <Grid item xs={5}>
                <h1 className="text-xl font-semibold pb-2">Product Ratings</h1>
                <div className="flex items-center space-x-3">
                  <Rating value={4.5} precision={.5} readOnly/>
                  <p className="opacity-60">54890 Ratings</p>
                </div>

                <Box className='mt-5 space-y-3'>
                  <Grid container alignItems="center"  gap={2}>
                    <Grid item xs={2}>
                      <p>Excellent</p>
                    </Grid>
                    <Grid items xs={7}>
                      <LinearProgress sx={{bgcolor:"#d0d0d0",borderRadius:4,height:7}} variant='determinate' value={40} color="success"/>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center"  gap={2}>
                    <Grid item xs={2}>
                      <p>Very Good</p>
                    </Grid>
                    <Grid items xs={7}>
                      <LinearProgress sx={{bgcolor:"#d0d0d0",borderRadius:4,height:7}} variant='determinate' value={30} color="success"/>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center"  gap={2}>
                    <Grid item xs={2}>
                      <p>Good</p>
                    </Grid>
                    <Grid items xs={7}>
                      <LinearProgress sx={{bgcolor:"#d0d0d0",borderRadius:4,height:7,color:"yellow"}} variant='determinate' value={25} className='bg-yellow-300'/>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center"  gap={2}>
                    <Grid item xs={2}>
                      <p>Avarage</p>
                    </Grid>
                    <Grid items xs={7}>
                      <LinearProgress sx={{bgcolor:"#d0d0d0",borderRadius:4,height:7}} variant='determinate' value={20} color="warning"/>
                    </Grid>
                  </Grid>
                   
                  <Grid container alignItems="center"  gap={2}>
                    <Grid item xs={2}>
                      <p>Poor</p>
                    </Grid>
                    <Grid items xs={7}>
                      <LinearProgress sx={{bgcolor:"#d0d0d0",borderRadius:4,height:7}} variant='determinate' value={10} color="error"/>
                    </Grid>
                  </Grid>


                </Box>
              </Grid>
            </Grid>
            
             </div>  

      </section>
    )
}
import { Avatar, Grid, Button } from '@mui/material';
import React from 'react';
import { Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductReviewCard = () => {
  const navigate = useNavigate();

  // Example reviews array
  const reviews = [
    {
      id: 1,
      name: "Raam",
      date: "April 5, 2024",
      rating: 4.5,
      comment: "Nice product. I love it very much.",
    },
  ];

  return (
    <div>
      {reviews.map((review) => (
        <Grid container spacing={2} gap={3} key={review.id} className="mb-4">
          <Grid item xs={1}>
            <Box>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "#9155fd" }}>
                {review.name[0]}
              </Avatar>
            </Box>
          </Grid>

          <Grid item xs={9}>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-lg">{review.name}</p>
                <p className="opacity-70">{review.date}</p>
              </div>
            </div>
            <Rating value={review.rating} name="half-rating" readOnly precision={0.5} />
            <p>{review.comment}</p>
          </Grid>
        </Grid>
      ))}

      {/* Add Review Button (only one button) */}
      <div className="mt-4 flex justify-end">
      </div>
    </div>
  );
};

export default ProductReviewCard;

import { Button, Container, Grid, Typography } from "@mui/material";
import React, { memo, FC } from "react";
import { useHistory } from "react-router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
interface PageNotFoundProps {}

const PageNotFound: FC<PageNotFoundProps> = memo(() => {
  const history = useHistory();
  return (
    <>
      <Container>
        <Grid
          container
          justifyContent="center"
          justifyItems="center"
          rowSpacing={3}
        >
          <Grid item xs={12}>
            <Typography fontWeight="bold" textAlign="center" variant="h1">
              404
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography textAlign="center" variant="h6">
              Page not found
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography textAlign="center" variant="body2" component="p">
              The link that you've clicked may be broken or the page may have
              been removed or renamed.
            </Typography>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => history.goBack()}
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default PageNotFound;

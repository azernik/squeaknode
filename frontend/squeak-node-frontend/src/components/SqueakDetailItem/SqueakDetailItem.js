import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  Link,
  Divider,
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import classnames from "classnames";

import ReplyIcon from '@material-ui/icons/Reply';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteIcon from '@material-ui/icons/Favorite';

// styles
import useStyles from "./styles";

import Widget from "../../components/Widget";

export default function SqueakDetailItem({
  squeak,
  handleAddressClick,
  handleSqueakClick,
  handleReplyClick,
  ...props
}) {
  var classes = useStyles();

  // local
  // var [moreButtonRef, setMoreButtonRef] = useState(null);
  // var [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

  const history = useHistory();

  const onAddressClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Handling address click...");
    if (handleAddressClick) {
      handleAddressClick();
    }
  }

  const onReplyClick = (event) => {
    event.preventDefault();
    console.log("Handling reply click...");
    if (handleReplyClick) {
      handleReplyClick();
    }
  }

  return (
    <Box
      p={1}
      m={0}
      bgcolor="background.paper"
      >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
                <Box fontWeight="fontWeightBold">
                  <Link href="#"
                    onClick={onAddressClick}>
                    {squeak.getAuthorName()}
                  </Link>
                </Box>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
          <Grid item>
            <Typography
              variant="h4"
              style={{whiteSpace: 'pre-line'}}
              >{squeak.getContentStr()}
            </Typography>
          </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
                <Box color="secondary.main">
                  {new Date(squeak.getBlockTime()*1000).toString()} (Block # {squeak.getBlockHeight()})
                </Box>
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={3} sm={1}>
              <Box
                p={1}
                onClick={onReplyClick}
                >
              <ReplyIcon />
            </Box>
            </Grid>
            <Grid item xs={3} sm={1}>
                <Box
                  p={1}
                  >
                  <RepeatIcon />
                </Box>
            </Grid>
            <Grid item xs={3} sm={1}>
                <Box
                  p={1}
                  >
                  <FavoriteIcon />
                </Box>
            </Grid>
          </Grid>
    </Box>
  )
}
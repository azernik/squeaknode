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

// styles
import useStyles from "./styles";

import Widget from "../../components/Widget";

export default function SqueakDetailItem({
  squeak,
  handleAddressClick,
  handleSqueakClick,
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

  const onSqueakClick = (event) => {
    event.preventDefault();
    console.log("Handling squeak click...");
    if (handleSqueakClick) {
      handleSqueakClick();
    }
  }

  return (
    <Grid item xs={12}
      onClick={onSqueakClick}
    >
        <Widget
          disableWidgetMenu
          upperTitle
          bodyClass={classes.fullHeightBody}
          className={classes.card}
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
              size="md"
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
                <Box>
                  <ReplyIcon />
                </Box>
            </Grid>
            <Grid item xs={3} sm={1}>
                <Box>
                  <ReplyIcon />
                </Box>
            </Grid>
            <Grid item xs={3} sm={1}>
                <Box>
                  <ReplyIcon />
                </Box>
            </Grid>
          </Grid>
        </Widget>
    </Grid>
  )
}

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Grid,
  Button,
  Box,
  CircularProgress,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

// styles

// components

import ComputerIcon from '@material-ui/icons/Computer';
import CloudOff from '@material-ui/icons/CloudOff';

import moment from 'moment';
import CreatePeerDialog from '../../components/CreatePeerDialog';

import useStyles from './styles';

import {
  connectSqueakPeerRequest,
  disconnectSqueakPeerRequest,
  getConnectedPeerRequest,
  getPeerByAddressRequest,
  // subscribeConnectedPeerRequest,
} from '../../squeakclient/requests';
import {
  goToPeerPage,
} from '../../navigation/navigation';

export default function PeerAddressPage() {
  const classes = useStyles();
  const history = useHistory();
  const { network, host, port } = useParams();
  const [savedPeer, setSavedPeer] = useState(null);
  const [connectedPeer, setConnectedPeer] = useState(null);
  const [waitingForSavedPeer, setWaitingForSavedPeer] = useState(false);
  const [waitingForConnectedPeer, setWaitingForConnectedPeer] = useState(false);
  const [createSavedPeerDialogOpen, setCreateSavedPeerDialogOpen] = useState(false);

  const getPeer = useCallback(() => {
    setWaitingForSavedPeer(true);
    getPeerByAddressRequest(network, host, port, (savedPeer => {
      setWaitingForSavedPeer(false);
      setSavedPeer(savedPeer);
    }));
  },
  [network, host, port]);
  const getConnectedPeer = useCallback(() => {
    setWaitingForConnectedPeer(true);
    getConnectedPeerRequest(network, host, port, handleLoadedConnectedPeer);
  },
  [network, host, port]);

  const disconnectPeer = useCallback(() => {
    setWaitingForConnectedPeer(true);
    disconnectSqueakPeerRequest(network, host, port, () => {
      getConnectedPeer();
    });
  },
  [network, host, port, getConnectedPeer]);

  const connectPeer = useCallback(() => {
    setWaitingForConnectedPeer(true);
    console.log(`Calling connectSqueakPeerRequest with ${network}`, host, port);
    connectSqueakPeerRequest(network, host, port, () => {
      getConnectedPeer();
    },
    handleConnectPeerError);
  },
  [network, host, port, getConnectedPeer]);

  // const subscribeConnectedPeer = useCallback(() => subscribeConnectedPeerRequest(host, port, (connectedPeer) => {
  //   setConnectedPeer(connectedPeer);
  // }),
  // [host, port]);

  const handleClickOpenCreateSavedPeerDialog = () => {
    setCreateSavedPeerDialogOpen(true);
  };

  const handleCloseCreateSavedPeerDialog = () => {
    setCreateSavedPeerDialogOpen(false);
  };

  useEffect(() => {
    getPeer();
  }, [getPeer]);
  useEffect(() => {
    getConnectedPeer();
  }, [getConnectedPeer]);
  // useEffect(() => {
  //   const stream = subscribeConnectedPeer();
  //   return () => stream.cancel();
  // }, [subscribeConnectedPeer]);

  const handleLoadedConnectedPeer = (resp) => {
    setWaitingForConnectedPeer(false);
    setConnectedPeer(resp);
  };

  const handleConnectPeerError = (err) => {
    setWaitingForConnectedPeer(false);
    alert(`Connect peer failure: ${err}`);
  };

  function DisconnectPeerButton() {
    return (
      <Box p={1}>
      <Button
        variant="contained"
        onClick={() => {
          disconnectPeer();
        }}
      >
        Disconnect Peer
      </Button>
      </Box>
    );
  }

  function ConnectPeerButton() {
    return (
      <Box p={1}>
      <Button
        variant="contained"
        onClick={() => {
          connectPeer();
        }}
      >
        Connect Peer
      </Button>
      </Box>
    );
  }

  function ConnectionActionContent() {
    return (
      <>
        <Grid item xs={12}>
          {(connectedPeer)
            ? DisconnectPeerButton()
            : ConnectPeerButton()}
        </Grid>
      </>
    );
  }

  function ConnectedPeerDetails() {
    const connectTimeS = connectedPeer.getConnectTimeS();
    const momentTimeString = moment(connectTimeS * 1000).fromNow();
    const lastMsgReceivedTimeS = connectedPeer.getLastMessageReceivedTimeS();
    const lastMsgReceivedString = moment(lastMsgReceivedTimeS * 1000).fromNow();
    const numMsgsReceived = connectedPeer.getNumberMessagesReceived();
    const numBytesReceived = connectedPeer.getNumberBytesReceived();
    const numMsgsSent = connectedPeer.getNumberMessagesSent();
    const numBytesSent = connectedPeer.getNumberBytesSent();
    return (
      <>
        <Box>
          {`Connect time: ${momentTimeString}`}
        </Box>
        <Box>
          {`Last message received: ${lastMsgReceivedString}`}
        </Box>
        <Box>
          {`Number of messages received: ${numMsgsReceived}`}
        </Box>
        <Box>
          {`Number of bytes received: ${numBytesReceived}`}
        </Box>
        <Box>
          {`Number of messages sent: ${numMsgsSent}`}
        </Box>
        <Box>
          {`Number of bytes sent: ${numBytesSent}`}
        </Box>
      </>
    );
  }

  function ConnectedPeerContent() {
    console.log(connectedPeer);
    return (
      <Card
        className={classes.root}
      >
        <CardHeader
          avatar={<ComputerIcon fontSize="large" style={{ fill: 'green' }} />}
          title={`Peer Address: ${`${host}:${port}`}`}
          subheader={ConnectedPeerDetails()}
        />
      </Card>
    );
  }

  function DisconnectedPeerContent() {
    console.log(connectedPeer);
    return (
      <Card
        className={classes.root}
      >
        <CardHeader
          avatar={<CloudOff fontSize="large" style={{ fill: 'red' }} />}
          title={`Peer Address: ${`${host}:${port}`}`}
          subheader="Disconnected"
        />
      </Card>
    );
  }

  function ConnectionContent() {
    return (
      <>
      {waitingForConnectedPeer
        ? WaitingIndicator()
        : ConnectionDisplay()}
      </>
    );
  }

  function ConnectionDisplay() {
    return (
      <>
        {ConnectionActionContent()}
        {(connectedPeer)
          ? ConnectedPeerContent()
          : DisconnectedPeerContent()}
      </>
    );
  }

  function WaitingIndicator() {
    return (
      <CircularProgress size={48} className={classes.buttonProgress} />
    );
  }

  function SavedPeerContent() {
    return (
      <>
        {savedPeer
          ? PeerContent()
          : NoPeerContent()}
        {CreateSavedPeerDialogContent()}
      </>

    );
  }

  function NoPeerContent() {
    return (
      <Box p={1}>
        <Button
          variant="contained"
          onClick={() => {
            handleClickOpenCreateSavedPeerDialog();
          }}
        >
          Save Peer
        </Button>
      </Box>
    );
  }

  function PeerContent() {
    return (
      <Box p={1}>
        <Button
          variant="contained"
          onClick={() => {
            goToPeerPage(history, savedPeer.getPeerId());
          }}
        >
          {savedPeer.getPeerName()}
        </Button>
      </Box>
    );
  }

  function CreateSavedPeerDialogContent() {
    return (
      <>
        <CreatePeerDialog
          open={createSavedPeerDialogOpen}
          handleClose={handleCloseCreateSavedPeerDialog}
          initialNetwork={network}
          initialHost={host}
          initialPort={port}
        />
      </>
    );
  }

  return (
    <>
      {!waitingForSavedPeer
        ? (
          <>
            {SavedPeerContent()}
            {ConnectionContent()}
          </>
        )
        : WaitingIndicator()}
    </>
  );
}

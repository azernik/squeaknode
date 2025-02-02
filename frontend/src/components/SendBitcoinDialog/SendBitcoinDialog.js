import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

// styles
import useStyles from './styles';

import {
  lndSendCoins,
} from '../../squeakclient/requests';
import {
  reloadRoute,
} from '../../navigation/navigation';

export default function SendBitcoinDialog({
  open,
  handleClose,
  ...props
}) {
  const classes = useStyles();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [satperbyte, setSatperbyte] = useState('');
  const [sendall, setSendall] = useState(false);

  const resetFields = () => {
    setAddress('');
    setAmount('');
    setSatperbyte('');
    setSendall(false);
  };

  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleChangeSatperbyte = (event) => {
    setSatperbyte(event.target.value);
  };

  const handleChangeSendall = (event) => {
    setSendall(event.target.checked);
  };

  const sendBitcoin = (address, amount, satperbyte, sendall) => {
    lndSendCoins(address, amount, satperbyte, sendall, (response) => {
      // setAddress(response.getAddress());
      // goToWalletPage(history);
      reloadRoute();
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log('address:', address);
    console.log('amount:', amount);
    console.log('satperbyte:', satperbyte);
    console.log('satperbyte number:', parseInt(satperbyte));
    console.log('sendall:', sendall);
    sendBitcoin(address, amount, parseInt(satperbyte), sendall);
    handleClose();
  }

  function SendBitcoinAddess() {
    return (
      <TextField
        id="standard-textarea"
        label="Address"
        variant="outlined"
        margin="normal"
        required
        autoFocus
        value={address}
        onChange={handleChangeAddress}
        fullWidth
      />
    );
  }

  function SendBitcoinAmount() {
    return (
      <TextField
        id="standard-textarea"
        label="Amount"
        variant="outlined"
        margin="normal"
        required
        value={amount}
        onChange={handleChangeAmount}
        disabled={sendall}
        fullWidth
      />
    );
  }

  function SendBitcoinSatperbyte() {
    return (
      <TextField
        id="standard-textarea"
        label="Satperbyte"
        variant="outlined"
        margin="normal"
        required
        value={satperbyte}
        onChange={handleChangeSatperbyte}
        fullWidth
      />
    );
  }

  function SendBitcoinSendall() {
    return (
      <FormControlLabel
        className={classes.formControlLabel}
        control={(
          <Switch
            checked={sendall}
            onChange={handleChangeSendall}
            name="send-all"
            size="small"
          />
        )}
        label="Send all"
      />
    );
  }

  function CancelButton() {
    return (
      <Button
        onClick={handleClose}
        variant="contained"
        color="secondary"
      >
        Cancel
      </Button>
    );
  }

  function SendBitcoinButton() {
    return (
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Send Bitcoin
      </Button>
    );
  }

  return (
    <Dialog open={open} onEnter={resetFields} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Send Bitcoin</DialogTitle>
      <form className={classes.root} onSubmit={handleSubmit} noValidate autoComplete="off">
        <DialogContent>
          {SendBitcoinAddess()}
        </DialogContent>
        <DialogContent>
          {SendBitcoinAmount()}
        </DialogContent>
        <DialogContent>
          {SendBitcoinSatperbyte()}
        </DialogContent>
        <DialogContent>
          {SendBitcoinSendall()}
        </DialogContent>
        <DialogActions>
          {CancelButton()}
          {SendBitcoinButton()}
        </DialogActions>
      </form>
    </Dialog>
  );
}

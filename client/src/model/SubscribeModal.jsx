import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function SubscribeModal({ open, handleClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const [email, setEmail] = React.useState(currentUser?.email);
  const [loading, setLoading] = React.useState(false);
  console.log(email);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userRef: currentUser?._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message);
        setLoading(false);
        return;
      } else {
        toast.success(data);
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent 
        >
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send latest tech blog related to Reactjs, Nextjs and many more.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="filled"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
           
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            {loading ? "Wait..." : "Subscribe"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

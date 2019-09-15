import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import HttpIcon from '@material-ui/icons/Http';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Switch } from '@material-ui/core';
import mapping from './mapping';

const Copyright = () =>
  <Typography variant="body2" color="textSecondary" align="center">
    <b>Domain Obfuscator</b> by <Link color="inherit" href="https://github.com/splitline">
      splitline
    </Link>.
  </Typography>
  ;

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { domain: '', noAscii: false, convertDot: false };
  }
  obfuscator(domain) {
    const replace = [];
    for (let i = 0; i < domain.length; ++i) {
      for (let j = 4; j >= 1; --j) {
        const searching = domain.substr(i, j);
        if(!this.state.convertDot && searching===".") continue;
        if (searching in mapping) {
          replace.push(searching);
          i += j - 1;
          break;
        }
      }
    }

    const select = arr => {
      arr = arr.filter(char =>
        (!this.state.noAscii || char > 0xff)
      );
      return String.fromCharCode(arr[Math.floor(Math.random() * arr.length)]);
    }
    replace.forEach(r => domain = domain.replace(r, select(mapping[r])))
    return domain;
  }
  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <HttpIcon />
          </Avatar>
          <Typography variant="h4">
            Domain Obfuscator
        </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="domain"
              label="Normal Domain Name"
              name="domain"
              onChange={e => this.setState({ domain: e.target.value })}
              autoFocus
            />
            <FormControlLabel
              control={<Switch color="primary" onChange={e => this.setState({ noAscii: e.target.checked })} />}
              label="No ASCII"
            />
            <FormControlLabel
              control={<Switch color="primary" onChange={e => this.setState({ convertDot: e.target.checked })} />}
              label="Convert Dot(.)"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => console.log(this.obfuscator(this.state.domain))}
            >
              Generate
          </Button>
          </div>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(App);
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Switch } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import HttpIcon from '@material-ui/icons/Http';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { CopyToClipboard } from 'react-copy-to-clipboard';

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
    this.state = { domain: '', noAscii: false, convertDot: false, log: [] };
  }
  obfuscator(domain) {
    const replace = [];
    for (let i = 0; i < domain.length; ++i) {
      for (let j = 4; j >= 1; --j) {
        const searching = domain.substr(i, j);
        if (!this.state.convertDot && searching === ".") continue;
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

  generate() {
    let domain;
    try {
      domain = new URL(this.state.domain).hostname;
    } catch (e) {
      domain = this.state.domain;
    }
    if (domain.trim() === '') return;
    const result = this.obfuscator(domain);
    this.setState({
      log: [result, ...this.state.log]
    });
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
              label="Normal Domain Name (ASCII Only)"
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
              onClick={this.generate.bind(this)}
            >
              Generate
            </Button>
            <Paper>
              {this.state.log.length ?
                <List>
                  {this.state.log.map((value, i) => (
                    <ListItem key={i} role={undefined} button>
                      <ListItemText primary={value} />
                      <ListItemSecondaryAction>
                        <CopyToClipboard text={value}>
                          <IconButton edge="end" aria-label="comments">
                            <FileCopyIcon />
                          </IconButton>
                        </CopyToClipboard>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  }
                </List> :
                (<div style={{padding:"1em", textAlign:"center"}}>
                  <Typography variant="h5">Try to generate something?</Typography>
                </div>)
              }
            </Paper>
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
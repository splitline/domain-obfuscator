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
    <Link color="inherit" href="https://github.com/splitline/domain-obfuscator">
      <b>Domain Obfuscator</b>
    </Link>
    {' by '}
    <Link color="inherit" href="https://github.com/splitline">
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
    this.state = {
      domain: '',
      noAscii: false,
      convertDot: false,
      weirdChar: false,
      log: [],
      noDuplicates: false,
      randomCharacters: false
    };
  }

  obfuscator(domain) {
    domain = domain.toLowerCase();
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

    const select = (arr, denylist) => {
      let filteredArr = arr.filter(char =>
        (!this.state.noAscii || char > 0xff) && !denylist.includes(String.fromCodePoint(char))
      );
      if (filteredArr.length === 0) {
        filteredArr = [...arr];
      }

      const charCode = this.state.randomCharacters ?
        filteredArr[Math.floor(Math.random() * filteredArr.length)] :
        filteredArr[0];

      return String.fromCodePoint(charCode);
    }
    replace.forEach(r => domain = domain.replace(r, select(mapping[r], (this.state.noDuplicates ? domain : []))));
    if (this.state.weirdChar) domain = domain.split("").join(select(mapping[""], (this.state.noDuplicates ? domain : [])));
    return domain;
  }

  generate() {
    let domain = this.state.domain;
    try {
      domain = new URL(this.state.domain).hostname;
    } catch (e) { }

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
            <FormControlLabel
              control={<Switch color="primary" onChange={e => this.setState({ weirdChar: e.target.checked })} />}
              label="Insert Weird Chars"
            />
            <FormControlLabel
              control={<Switch color="primary" onChange={e => this.setState({ noDuplicates: e.target.checked })} />}
              label="No duplicates"
            />
            <FormControlLabel
              control={<Switch color="primary" onChange={e => this.setState({ randomCharacters: e.target.checked })} />}
              label="Random substitution characters"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => this.generate()}
            >
              Generate
            </Button>
            <Paper>
              {this.state.log.length ?
                <List>
                  {this.state.log.map((value, i) => {
                    const regex = new RegExp(`[${mapping[""].map(c => String.fromCodePoint(c)).join('')}]`, "g");
                    const printable = value.replace(regex, "␣");
                    return (
                      <ListItem key={i} button component="a" href={`http://${value}`} target="_blank">
                        <ListItemText primary={printable} />
                        <ListItemSecondaryAction>
                          <CopyToClipboard text={value}>
                            <IconButton edge="end" aria-label="comments">
                              <FileCopyIcon />
                            </IconButton>
                          </CopyToClipboard>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })
                  }
                </List> :
                (<div style={{ padding: "3em", textAlign: "center" }}>
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
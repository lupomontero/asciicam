import React from 'react';
import Preview from './Preview';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

const App = (props) => (
  <div style={styles.root}>
    <Preview cols={80} rows={80} />
  </div>
);

export default App;

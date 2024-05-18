import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ConfirmProvider } from 'material-ui-confirm';

import './App.css';
import { defaultTheme } from 'themes/default';
import Login from 'pages/Login';
import Main from 'pages/Main/Main';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ConfirmProvider>
        <div id="lac">
          {localStorage.getItem('token') ? (
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Main />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          )}
        </div>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;

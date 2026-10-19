import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';

export default function ToastSnackbar({ snackbar, onClose }) {
  const { isDark } = useThemeMode();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity || 'info'}
        sx={{
          width: '100%',
          bgcolor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.6)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

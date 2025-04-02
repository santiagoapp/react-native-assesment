const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  primary: '#212121', // Header background
  secondary: '#757575', // Secondary background (movie title, favorite button)
  text: {
    primary: '#FFFFFF',
    secondary: '#E0E0E0',
    dark: '#000000',
  },
  background: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  border: '#CCCCCC',
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorLight,
    primary: '#007BFF',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    accent: '#ff4081',
    border: '#e0e0e0',
    card: '#f8f9fa',
    notification: '#ff3b30'
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorDark,
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    accent: '#ff4081',
    border: '#343a40',
    card: '#212529',
    notification: '#ff453a'
  },
};
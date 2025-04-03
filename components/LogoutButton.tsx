import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/utils/alertUtils';

interface LogoutButtonProps {
  color?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ color = '#fff' }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.warning(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // No need to navigate - the ProtectedRoute component will handle redirection
            } catch (error) {
              console.error('Logout error:', error);
              Alert.error('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button} testID="logout-button">
      <FontAwesome name="sign-out" size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
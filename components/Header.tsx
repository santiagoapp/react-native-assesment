import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MovieCategory } from "@/types/movie";
import { LogoutButton } from "@/components/LogoutButton";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onCategoryChange?: (category: MovieCategory) => void;
  currentCategory?: MovieCategory;
  disableMenu?: boolean;
}

export function Header({
  title,
  showBackButton = false,
  onCategoryChange,
  currentCategory = "top_rated",
  disableMenu = false,
}: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              testID="header-back-button"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={showBackButton ? styles.middleSection : styles.centerSection}
        >
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
          <LogoutButton />
          {!disableMenu && (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              testID="header-menu-button"
              style={styles.menuButton}
            >
              <Text style={styles.menuIcon}>⋮</Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  currentCategory === "top_rated" && styles.selectedMenuItem,
                ]}
                onPress={() => {
                  onCategoryChange?.("top_rated");
                  setMenuVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.menuText,
                    currentCategory === "top_rated" && styles.selectedMenuText,
                  ]}
                >
                  Top Rated
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  currentCategory === "popular" && styles.selectedMenuItem,
                ]}
                onPress={() => {
                  onCategoryChange?.("popular");
                  setMenuVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.menuText,
                    currentCategory === "popular" && styles.selectedMenuText,
                  ]}
                >
                  Popular
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuButton: {
    marginLeft: 10,
  },
  menuContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginTop: 60,
    marginRight: 16,
    overflow: "hidden",
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedMenuItem: {
    backgroundColor: "#333",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedMenuText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerWrapper: {
    backgroundColor: "#212121",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  headerContainer: {
    height: 56,
    backgroundColor: "#212121",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    opacity: 1,
  },
  leftSection: {
    width: 40,
    alignItems: "flex-start",
  },
  middleSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  backButton: {
    padding: 4,
  },
  menuIcon: {
    color: "#fff",
    fontSize: 24,
  },
});

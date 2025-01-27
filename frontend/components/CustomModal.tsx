import React from "react";
import { View, Text, TextInput, StyleSheet, Modal, Alert } from "react-native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import { Ionicons } from "@expo/vector-icons";

interface CustomModalProps {
  visible: boolean;
  field: string | null;
  value: string;
  confirmValue?: string;
  onChange: (text: string) => void;
  onConfirmChange?: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  field,
  value,
  confirmValue,
  onChange,
  onConfirmChange,
  onSave,
  onCancel,
  showPassword = false,
  togglePasswordVisibility,
}) => {
  const handleLocalSave = () => {
    if (field === "password" && value !== confirmValue) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    onSave();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.label}>Enter new {field}:</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            secureTextEntry={field === "password" && !showPassword}
            keyboardType={field === "email" ? "email-address" : "default"}
          />
          {field === "password" && (
            <>
              <Text style={styles.label}>Confirm new password:</Text>
              <TextInput
                style={styles.input}
                value={confirmValue}
                onChangeText={onConfirmChange}
                secureTextEntry={!showPassword}
              />
              
            </>
          )}
          <SmallPressableCustom label="Save" onPress={handleLocalSave} />
          <SmallPressableCustom label="Cancel" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIconInside: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default CustomModal;

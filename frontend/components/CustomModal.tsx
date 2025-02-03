import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal } from "react-native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import { Ionicons } from "@expo/vector-icons";
import CustomAlertModal from "@/components/CustomAlertModal"; // Import CustomAlertModal

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

const CustomModal = ({
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
}:CustomModalProps) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false); // Add alert visibility state
  const [fieldError, setFieldError] = useState(false);

  const handleLocalSave = () => {
    // Reset error
    setFieldError(false);

    // Check if empty
    if (!value) {
      setFieldError(true);
      return;
    }

    // Check email format for email field
    if (field === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      setFieldError(true);
      return;
    }

    // Check password match if needed
    if (field === "password" && value !== confirmValue) {
      setIsAlertVisible(true); // Show custom alert modal
      return;
    }

    onSave();
  };

  const handleCloseAlert = () => {
    setIsAlertVisible(false); // Hide custom alert modal
  };

  return (
    <>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Enter new {field}:</Text>
            <TextInput
              style={[styles.input, fieldError && styles.inputError]} // Dynamically apply red border
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

      <CustomAlertModal
        visible={isAlertVisible}
        title="Error"
        errorMessage="Passwords do not match"
        onClose={handleCloseAlert}
        singleButton={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(58, 47, 35, 0.7)', // Darker overlay
  },
  modalContent: {
    width: '80%',
    padding: 25,
    backgroundColor: '#EFEDE6', // Light background for contrast
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderColor: '#A98955', // Updated border color
    borderWidth: 2,
  },
  label: {
    fontSize: 22, // Increased font size
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#3A2F23',
  },
  input: {
    width: '100%', // Make input width 100% of the modal content
    height: 40,
    borderColor: '#A98955', // Changed border color
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 15, // Add margin bottom for spacing
    textAlign: 'left', // Align text to the left
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
  inputError: {
    borderColor: "red",
  },
});

export default CustomModal;

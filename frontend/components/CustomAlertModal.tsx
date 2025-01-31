import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { SmallPressableCustom } from './SmallPressableCustom';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  errorMessage: string;
  onClose: () => void;
  onConfirm?: () => void;
  singleButton?: boolean;
}

const CustomAlertModal = ({ visible, title, errorMessage, onClose, onConfirm, singleButton }:CustomAlertModalProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <View style={styles.buttonContainer}>
              {singleButton ? (
                <SmallPressableCustom label="Accept" onPress={onConfirm || onClose} />
              ) : (
                <>
                  <SmallPressableCustom label="Accept" onPress={onConfirm || onClose} />
                  <View style={styles.buttonSpacer} />
                  <SmallPressableCustom label="Cancel" onPress={onClose} />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#EFEDE6',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#8D602D',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#3A2F23',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#3A2F23',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 10,
  },
});

export default CustomAlertModal;

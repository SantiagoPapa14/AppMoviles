import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TextInput, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import WeekView, { createFixedWeekDate } from 'react-native-week-view';
import { useAuth } from '@/app/context/AuthContext';
import {SmallPressableCustom} from '@/components/SmallPressableCustom';
import { customAlertModal } from '@/components/CustomAlertModal';
import CustomAlertModal from '@/components/CustomAlertModal';

interface Event {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  color: string; // Add color property
}

const UserTimeTableScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#8B4513'); // Default color
  const colors = ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DAA520', ];
  const { secureFetch, fetchProfile } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!fetchProfile) {
          throw new Error("fetchProfile is undefined");
        }
        const profile = await fetchProfile();
        const userId = profile.userId;

        if (!secureFetch) {
          throw new Error("secureFetch is undefined");
        }
        const timetable = await secureFetch(`/timetable/${userId}`);
        if (Array.isArray(timetable)) {
          const parsedTimetable = timetable.map(event => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
          }));
          setEvents(parsedTimetable);
        } else {
          console.error("Fetched timetable is not an array");
        }
      } catch (error) {
        console.error("Failed to fetch timetable", error);
      }
    };
    fetchTimetable();
  }, [fetchProfile, secureFetch]);

  useEffect(() => {
    console.log("Current events:", events);
  }, [events]);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleGridPress = (event: any, startHour: number, date: Date) => {
    const newEvent: Event = {
      id: events.length + 1,
      description: '',
      startDate: new Date(date.setHours(startHour, 0, 0, 0)),
      endDate: new Date(date.setHours(startHour + 1, 0, 0, 0)),
      color: selectedColor, // Use selected color
    };
    setSelectedEvent(newEvent);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (!fetchProfile) {
        throw new Error("fetchProfile is undefined");
      }
      const profile = await fetchProfile();
      const userId = profile.userId;

      if (!secureFetch) {
        throw new Error("secureFetch is undefined");
      }
      await secureFetch(`/timetable/update`, {
        method: "PATCH",
        body: JSON.stringify({ userId, timetable: events }),
      });
      showAlert("Success", "Timetable saved successfully");
    } catch (error) {
      console.error("Failed to save timetable", error);
    }
  };

  const handleModalSave = () => {
    if (selectedEvent) {
      if (!selectedEvent.description.trim()) {
        setDescriptionError(true);
        showAlert("Error", "Description cannot be empty");
        return;
      }
      if (selectedEvent.id > events.length) {
        setEvents([...events, selectedEvent]);
      } else {
        setEvents(events.map(event => event.id === selectedEvent.id ? selectedEvent : event));
      }
      setModalVisible(false);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setModalVisible(false);
    }
  };

  const handleStartTimeChange = (event: any, date: Date | undefined) => {
    setShowStartPicker(false);
    if (date && selectedEvent) {
      if (date >= selectedEvent.endDate) {
        showAlert("Invalid Time", "Start time cannot be later than end time");
      } else {
        setSelectedEvent({ ...selectedEvent, startDate: date } as Event);
      }
    }
  };

  const handleEndTimeChange = (event: any, date: Date | undefined) => {
    setShowEndPicker(false);
    if (date && selectedEvent) {
      if (date <= selectedEvent.startDate) {
        showAlert("Invalid Time", "End time cannot be earlier than start time");
      } else {
        setSelectedEvent({ ...selectedEvent, endDate: date } as Event);
      }
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, color });
    }
    setShowColorPicker(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timeTableContainer}>
        <WeekView
          events={events}
          fixedHorizontally={true}
          numberOfDays={5}
          onEventPress={handleEventPress}
          onGridClick={handleGridPress}
          formatDateHeader="ddd"
          hoursInDisplay={12}
          startHour={12}
          startDay={1}  // Start on Monday
          showTitle={false}  // Remove month and year
        />
        <SmallPressableCustom label="Save Timetable" onPress={handleSave} />
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedEvent?.id > events.length ? 'Create Event' : 'Edit Event'}</Text>
            <TextInput
              style={[styles.input, descriptionError && styles.inputError]}
              placeholder="Description"
              value={selectedEvent?.description}
              onChangeText={(text) => {
                setSelectedEvent({ ...selectedEvent, description: text } as Event);
                setDescriptionError(false);
              }}
            />
            <Text style={styles.timeText}>
              {selectedEvent?.startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {selectedEvent?.endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <SmallPressableCustom label="Pick Start Time" onPress={() => setShowStartPicker(true)} />
            {showStartPicker && (
              <DateTimePicker
                value={selectedEvent?.startDate || new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleStartTimeChange}
              />
            )}
            <SmallPressableCustom label="Pick End Time" onPress={() => setShowEndPicker(true)} />
            {showEndPicker && (
              <DateTimePicker
                value={selectedEvent?.endDate || new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleEndTimeChange}
              />
            )}
            <SmallPressableCustom label="Pick Color" onPress={() => setShowColorPicker(true)} />
            {showColorPicker && (
              <View style={styles.colorPickerBox}>
                <View style={styles.colorPicker}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorOption, { backgroundColor: color }]}
                      onPress={() => handleColorChange(color)}
                    />
                  ))}
                </View>
              </View>
            )}
            <View style={styles.buttonRow}>
              <SmallPressableCustom label="Save" onPress={handleModalSave} />
              <SmallPressableCustom label="Cancel" onPress={() => setModalVisible(false)} />
            </View>
            {selectedEvent?.id <= events.length && (
              <SmallPressableCustom label="Delete" onPress={handleDeleteEvent} />
            )}
          </View>
        </View>
      </Modal>
      <CustomAlertModal
        visible={alertVisible}
        title={alertTitle}
        errorMessage={alertMessage}
        onClose={() => setAlertVisible(false)}
        singleButton
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  timeTableContainer: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#EFEDE6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  timeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  colorPickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default UserTimeTableScreen;

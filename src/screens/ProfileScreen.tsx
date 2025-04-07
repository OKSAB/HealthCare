import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

type RootStackParamList = {
  Dashboard: {userEmail?: string};
  Profile: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

interface UserProfile {
  email: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  height?: string;
  weight?: string;
}

const {width} = Dimensions.get('window');

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {userEmail} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No userEmail found in global context');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userEmail}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to fetch user');
      }
      const data = await response.json();
      setUserProfile(data);
      setEditedProfile(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    if (isEditing) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard changes?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setIsEditing(false);
              setEditedProfile(userProfile);
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedProfile || !userEmail) {return;}
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userEmail}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          first_name: editedProfile.first_name || '',
          last_name: editedProfile.last_name || '',
          dob: editedProfile.dob || '',
          height: editedProfile.height || '',
          weight: editedProfile.weight || '',
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to update profile');
      }
      await fetchUserProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const renderField = (
    label: string,
    value: string | undefined,
    onChange: (val: string) => void,
    editable: boolean,
  ) => {
    return (
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.input}
            value={value || ''}
            onChangeText={onChange}
            placeholderTextColor="#666"
          />
        ) : (
          <Text style={styles.infoValue}>{value || 'N/A'}</Text>
        )}
      </View>
    );
  };

  if (!userProfile || !editedProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>
          {isLoading ? 'Loading...' : 'No user data found.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        {isEditing && <View style={styles.editButton} />}
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          {renderField('Email', editedProfile.email, () => {}, false)}
          {renderField(
            'First Name',
            editedProfile.first_name,
            val => setEditedProfile({...editedProfile, first_name: val}),
            isEditing,
          )}
          {renderField(
            'Last Name',
            editedProfile.last_name,
            val => setEditedProfile({...editedProfile, last_name: val}),
            isEditing,
          )}
          {renderField(
            'Date of Birth',
            editedProfile.dob,
            val => setEditedProfile({...editedProfile, dob: val}),
            isEditing,
          )}
          {renderField(
            'Height',
            editedProfile.height,
            val => setEditedProfile({...editedProfile, height: val}),
            isEditing,
          )}
          {renderField(
            'Weight',
            editedProfile.weight,
            val => setEditedProfile({...editedProfile, weight: val}),
            isEditing,
          )}
        </View>
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscard}
              disabled={isLoading}>
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    height: 60,
  },
  backButton: {padding: 10},
  backText: {color: '#FFF', fontSize: 16},
  headerTitle: {color: '#FFFFFF', fontSize: 20, fontWeight: '600'},
  editButton: {padding: 10},
  editButtonText: {color: '#FFFFFF', fontSize: 16},
  content: {flex: 1, paddingHorizontal: width * 0.06},
  infoContainer: {marginTop: 20},
  infoItem: {marginBottom: 20},
  infoLabel: {color: '#FFFFFF', fontSize: 16, marginBottom: 5},
  infoValue: {color: '#FFFFFF', fontSize: 18},
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 10,
    color: '#FFFFFF',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  discardButton: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  discardButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  loadingText: {color: '#FFF', marginTop: 50, textAlign: 'center'},
});

export default ProfileScreen;

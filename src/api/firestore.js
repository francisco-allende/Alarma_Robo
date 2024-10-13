import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const userCollection = firestore().collection('users');

export const saveUserPassword = async (userId, password) => {
  try {
    await userCollection.doc(userId).set(
      {
        password: password,
      },
      {merge: true},
    );
  } catch (error) {
    console.error('Error saving user password:', error);
    throw error;
  }
};

export const getUserPassword = async userId => {
  try {
    const userDoc = await userCollection.doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data().password;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user password:', error);
    throw error;
  }
};

export const getCurrentUserId = () => {
  const user = auth().currentUser;
  return user ? user.uid : null;
};

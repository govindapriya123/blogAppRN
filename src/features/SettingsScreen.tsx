import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { List, Switch } from 'react-native-paper';
import styled, { useTheme } from 'styled-components/native';
import { getItem, setItemAsync, clearStorage } from '../helpers/Storage';
import store from '../store';
import { turnTheme } from '../ThemeSlice';
import { useNavigation } from '@react-navigation/native';

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.primaryBackground || '#F2F2F2'};
`;

const SectionCard = styled(View)`
  background-color: ${(props) => props.theme.cardBackground || '#FFFFFF'};
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 20px;

  /* SHADOW FOR iOS */
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;

  /* ELEVATION FOR ANDROID */
  elevation: 5;
`;


function SettingsScreen() {
  const theme = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = async () => {
    const nextTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    await setItemAsync('app_theme', nextTheme);
    store.dispatch(turnTheme(nextTheme));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearStorage();
         // rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
         navigation.navigate("Login");
        },
      },
    ]);
  };

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await getItem('app_theme');
      setIsDarkTheme(savedTheme === 'dark');
    }
    loadTheme();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container bounces={false}>

        {/* Appearance Section */}
        <SectionCard>
          <List.Subheader style={[styles.sectionHeader, { color: theme.text }]}>
            Appearance
          </List.Subheader>

          <List.Item
            title="Dark Mode"
            titleStyle={{ color: theme.text }}
            left={() => <List.Icon icon="theme-light-dark" color={theme.text} />}
            right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
          />
        </SectionCard>

        {/* Info Section */}
        <SectionCard>
          <List.Subheader style={[styles.sectionHeader, { color: theme.text }]}>
            Information
          </List.Subheader>

          <List.Item
            title="About App"
            titleStyle={{ color: theme.text }}
            left={() => <List.Icon icon="information-outline" color={theme.text} />}
            onPress={() => Alert.alert('About', 'Blog App v1.0\nCreated by Govindapriya')}
          />

          <List.Item
            title="Privacy Policy"
            titleStyle={{ color: theme.text }}
            left={() => <List.Icon icon="lock-outline" color={theme.text} />}
            onPress={() => Alert.alert('Privacy Policy', 'Your data is safe.')}
          />
        </SectionCard>

        {/* Account Section */}
        <SectionCard>
          <List.Subheader style={[styles.sectionHeader, { color: theme.text }]}>
            Account
          </List.Subheader>

          <List.Item
            title="Logout"
            titleStyle={{ color: 'red' }}
            left={() => <List.Icon icon="logout" color="red" />}
            onPress={handleLogout}
          />
        </SectionCard>

      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: Platform.OS === 'ios' ? 4 : 0,
  },
});

export default SettingsScreen;

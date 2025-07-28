import React, { useLayoutEffect } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useTheme } from 'styled-components';
import { formatDate } from '../helpers/Util';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getItem } from '../helpers/Storage';
import axios from 'axios';

function PostDetailsScreen({ route }) {
  const BASE_URL = 'http://192.168.0.126:8086'; // Replace with your actual IP or domain in production
  const { post } = route.params;
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const navigation = useNavigation();
  const imageUrls = post?.imageNames?.map((name) => `${BASE_URL}/images/${name}`);

  const handleEdit = () => {
    navigation.navigate('CreatePost', { post });
  };

  const handleDelete = async () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const authToken = await getItem('authToken');
            await axios.delete(`${BASE_URL}/api/posts/${parseInt(post?.id)}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
          } catch (error) {
            console.error('Error deleting post:', error);
          }
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 8, marginRight: 10 }}>
          <IconButton icon="pencil" iconColor="#0d6efd" size={22} onPress={handleEdit} />
          <IconButton icon="delete" iconColor="#dc3545" size={22} onPress={handleDelete} />
        </View>
      ),
    });
  }, [navigation, post]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>{post.title}</Text>

        <Text style={[styles.meta, { color: theme.textSecondary }]}> 
          {post.category?.name} • By {post.author} • {formatDate(post.created_at)}
        </Text>

        <RenderHTML
          contentWidth={width}
          source={{ html: post.content }}
          tagsStyles={{
            p: { color: theme.text, fontSize: 16, lineHeight: 24 },
            h1: { fontSize: 24, fontWeight: 'bold', color: theme.primary },
          }}
        />

        <View style={styles.imageContainer}>
          {imageUrls?.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} resizeMode="cover" />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    marginBottom: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 12,
  },
  imageContainer: {
    marginTop: 12,
    gap: 12,
  },
});

export default PostDetailsScreen;

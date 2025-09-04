import React, {useEffect} from 'react';
import {FlatList, Text, useWindowDimensions, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../utils/hooks';
import styled from 'styled-components/native';
import {Avatar, Card, IconButton} from 'react-native-paper';
import {
  fetchBookMarkedPosts,
  toggleBookMark,
  updateBookmarkPosts,
} from '../store/slices/bookMarkSlice';
import {formatDate, profilePicURL} from '../helpers/Util';
import RenderHTML from 'react-native-render-html';
import {updateBookmarkStatus} from '../store/slices/postsSlice';
const Container = styled.View`
flex:1;
padding:10px;
background-color:${(props) => props.theme.primaryBackground || '#FFFFFF'};
`;
const PostCard = styled(Card)`
margin-bottom:10px;
border-radius:10px;
background-color:${(props) => props.theme.cardBackground || '#FFFFFF'};
`;
function BookmarksScreen({navigation}) {
  const savedPosts = useAppSelector(
    (state: any) => state.bookmark.bookmarkedPosts,
  );
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();
  useEffect(() => {
    const bookmarkedPosts = async () => {
      const savedPosts = await dispatch(fetchBookMarkedPosts());
      console.log('savedPosts', savedPosts);
    };
    bookmarkedPosts();
  }, []);
  console.log('savedPosts', savedPosts);
  const toggleBookmark = async (postId: number) => {
    await dispatch(toggleBookMark(postId));
    await dispatch(updateBookmarkPosts(postId));
  };
  return (
    <Container>
      <FlatList
        data={savedPosts}
        keyExtractor={item => Math.random().toString()}
        bounces={false}
        renderItem={({item}) => (
          <PostCard
            onPress={() => navigation.navigate('PostDetails', {post: item})}>
            <Card.Title
              title={item.title}
              subtitle={formatDate(item.createdAt)}
              left={(props) => <Avatar.Image {...props} source={{uri:`${profilePicURL}/${item.user.username}.jpg`}} />}
              right={props => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <IconButton
                    {...props}
                    icon={item.bookmarked ? 'bookmark' : 'bookmark-outline'}
                    iconColor="#ffb703"
                    size={20}
                    onPress={() => toggleBookmark(item.id)}
                  />
                </View>
              )}
            />
            <Card.Content>
              <RenderHTML
                source={{html: item.content}}
                baseStyle={{
                  fontSize: 14,
                  color: '#333',
                }}
                contentWidth={width}
                defaultTextProps={{
                  numberOfLines: 2,
                  ellipsizeMode: 'tail', // Ensure ellipsis is applied
                }}
              />
            </Card.Content>
          </PostCard>
        )}
      />
    </Container>
  );
}
export default BookmarksScreen;

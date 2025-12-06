import { supabase } from './supabase';
import { postActivity, ActivityTypes, isConnected } from './getstream';

/**
 * Create a new post
 * Saves to Supabase AND posts to GetStream
 */
export const createPost = async (userId, userName, content, audience = 'everyone') => {
  try {
    // 1. Save to Supabase
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        user_name: userName,
        content: content,
        audience: audience
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ Post saved to Supabase:', post);

    // 2. Post activity to GetStream
    if (isConnected()) {
      const activity = {
        actor: userId,
        verb: ActivityTypes.POST_CREATED,
        object: `post:${post.id}`,
        content: content,
        foreign_id: `post:${post.id}`,
        time: new Date().toISOString()
      };

      const streamResult = await postActivity(userId, activity);
      console.log('✅ Activity posted to GetStream:', streamResult);
    } else {
      console.log('⚠️ GetStream not connected, skipping activity post');
    }

    return { success: true, post };

  } catch (error) {
    console.error('❌ Error creating post:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all posts from Supabase
 */
export const getPosts = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, posts: data || [] };

  } catch (error) {
    console.error('Error getting posts:', error);
    return { success: false, posts: [], error: error.message };
  }
};

/**
 * Like a post
 */
export const likePost = async (postId) => {
  try {
    // Get current likes
    const { data: post } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    // Increment likes
    const { data, error } = await supabase
      .from('posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, post: data };

  } catch (error) {
    console.error('❌ Error liking post:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { success: true };

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    return { success: false, error: error.message };
  }
};

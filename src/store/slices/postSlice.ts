import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IPost } from "@/interface";
import {
  getPostsApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
} from "@/services/postService";
import type { CreatePostPayload, UpdatePostPayload } from "@/interface";

// ── State ──

interface PostState {
  posts: IPost[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
};

// ── Thunks ──

interface FetchPostsParams {
  brand_id: number;
  page?: number;
  limit?: number;
  type?: string;
  sort?: string;
}

export const fetchBrandPosts = createAsyncThunk<
  {
    posts: IPost[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  },
  FetchPostsParams,
  { rejectValue: string }
>("posts/fetchBrandPosts", async (params, { rejectWithValue }) => {
  try {
    const response = await getPostsApi({
      brand_id: params.brand_id,
      page: params.page || 1,
      limit: params.limit || 20,
      type: params.type,
      sort: params.sort || "newest",
    });
    return {
      posts: response.data,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch posts",
    );
  }
});

export const addPost = createAsyncThunk<
  IPost,
  CreatePostPayload,
  { rejectValue: string }
>("posts/addPost", async (data, { rejectWithValue }) => {
  try {
    const response = await createPostApi(data);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create post",
    );
  }
});

export const editPost = createAsyncThunk<
  IPost,
  { id: number; data: UpdatePostPayload },
  { rejectValue: string }
>("posts/editPost", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updatePostApi(id, data);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update post",
    );
  }
});

export const removePost = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("posts/removePost", async (id, { rejectWithValue }) => {
  try {
    const response = await deletePostApi(id);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete post",
    );
  }
});

// ── Slice ──

const postSlice = createSlice({
  name: "brandPosts",
  initialState,
  reducers: {
    clearPostError(state) {
      state.error = null;
    },
    resetPosts() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchBrandPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBrandPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      // add
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.totalCount += 1;
      })
      // edit
      .addCase(editPost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.posts[idx] = action.payload;
        }
      })
      // remove (soft-delete — remove from list)
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export const { clearPostError, resetPosts } = postSlice.actions;
export default postSlice.reducer;

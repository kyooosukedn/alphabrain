import { topicsApi } from "@/services/api";
import { CreateTopicRequest, Topic } from "@/types/topic";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TopicsState {
    topics: Topic[];
    currentTopic: Topic | null;
    loading: boolean;
    error: string | null;
}

const initialState: TopicsState = {
    topics: [],
    currentTopic: null,
    loading: false,
    error: null,
};

export const fetchTopics = createAsyncThunk(
    'topics/fetchTopics',
    async (_, { rejectWithValue }) => {
        try {
          const response = await topicsApi.getTopics();
          return response.data;
        } catch (error) {
          return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch topics');
        }
      }
);

export const createTopic = createAsyncThunk(
    'topics/createTopic',
    async (topic: CreateTopicRequest, { rejectWithValue }) => {
        try {
          const response = await topicsApi.createTopic(topic);
          return response.data;
        } catch (error) {
          return rejectWithValue(error instanceof Error ? error.message : 'Failed to create topic');
        }
      }
)

export const updateTopic = createAsyncThunk(
    'topics/updateTopic',
    async ({ id, topic }: { id: string; topic: Partial<CreateTopicRequest> }, { rejectWithValue }) => {
        try {
          const response = await topicsApi.updateTopic(id, topic);
          return response.data;
        } catch (error) {
          return rejectWithValue(error instanceof Error ? error.message : 'Failed to update topic');
        }
      }
)

export const deleteTopic = createAsyncThunk(
    'topics/deleteTopic',
    async (id: string, { rejectWithValue }) => {
        try {
          const response = await topicsApi.deleteTopic(id);
          return response.data;
        } catch (error) {
          return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete topic');
        }
      }
)

const topicsSlice = createSlice({
    name:'topics',
    initialState,
    reducers: {
        setCurrentTopic: (state, action: PayloadAction<Topic | null>) => {
            state.currentTopic = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
          // Fetch Topics
          .addCase(fetchTopics.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
            state.loading = false;
            state.topics = action.payload;
          })
          .addCase(fetchTopics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          // Create Topic
          .addCase(createTopic.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
            state.loading = false;
            state.topics.push(action.payload);
          })
          .addCase(createTopic.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          // Update Topic
          .addCase(updateTopic.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
            state.loading = false;
            const index = state.topics.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
              state.topics[index] = action.payload;
            }
            if (state.currentTopic?.id === action.payload.id) {
              state.currentTopic = action.payload;
            }
          })
          .addCase(updateTopic.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          // Delete Topic
          .addCase(deleteTopic.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteTopic.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.topics = state.topics.filter((t) => t.id !== action.payload);
            if (state.currentTopic?.id === action.payload) {
              state.currentTopic = null;
            }
          })
          .addCase(deleteTopic.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
    }
})



export const { setCurrentTopic, clearError} = topicsSlice.actions;
export default topicsSlice.reducer;

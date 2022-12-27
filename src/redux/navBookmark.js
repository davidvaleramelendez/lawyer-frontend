// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Constant
import {
    bookmarks
} from '@src/configs/navBookmarkConfig'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// ** Axios Imports
import axios from 'axios'

async function getBookmarksRequest(params) {
    return axios.get(`${API_ENDPOINTS.navBookmark.list}`, { params }).then((navBookmark) => navBookmark.data).catch((error) => error)
}

export const getBookmarks = createAsyncThunk('appNavBookmark/getBookmarks', async (params) => {
    try {
        const response = await getBookmarksRequest(params)
        if (response && response.flag) {
            return {
                params,
                bookmarkItems: response.data,
                suggestionItems: bookmarks,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                bookmarkItems: [],
                suggestionItems: bookmarks,
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        console.log("getBookmarks catch ", error)
        return {
            params,
            bookmarkItems: [],
            suggestionItems: bookmarks,
            actionFlag: "",
            success: "",
            error
        }
    }
})

async function updateBookmarkRequest(payload) {
    return axios.post(`${API_ENDPOINTS.navBookmark.update}`, payload).then((navBookmark) => navBookmark.data).catch((error) => error)
}

export const updateBookmarked = createAsyncThunk('appNavBookmark/updateBookmarked', async (payload) => {
    try {
        const response = await updateBookmarkRequest(payload)
        if (response && response.flag) {
            return {
                id: payload.bookmark_id || "",
                actionFlag: "",
                success: response.message,
                error: ""
            }
        } else {
            return {
                id: "",
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("updateBookmarked catch ", error)
        return {
            id: "",
            actionFlag: "",
            success: "",
            error
        }
    }
})

export const navBookmarkSlice = createSlice({
    name: 'appNavBookmark',
    initialState: {
        params: {},
        searchQuery: "",
        bookmarkItems: [],
        suggestionItems: bookmarks,
        actionFlag: "",
        loading: false,
        success: "",
        error: ""
    },
    reducers: {
        handleSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },

        clearNavBookmarksMessage: (state) => {
            state.actionFlag = ""
            state.success = ""
            state.error = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBookmarks.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.bookmarkItems = action.payload.bookmarkItems
                state.suggestionItems = action.payload.suggestionItems
                state.actionFlag = action.payload.actionFlag
                state.loading = true
                state.success = action.payload.success
                state.error = action.payload.error
            })
            .addCase(updateBookmarked.fulfilled, (state, action) => {
                let objectToUpdate

                // ** find & update object
                state.suggestionItems.find(item => {
                    if (item.bookmark_id === action.payload.id) {
                        item.is_bookmarked = item.is_bookmarked === 0 ? 1 : 0
                        objectToUpdate = item
                    }
                })

                // ** Get index to add or remove bookmark from array
                const bookmarkIndex = state.bookmarkItems.findIndex(x => x.bookmark_id === action.payload.id)

                if (bookmarkIndex === -1) {
                    state.bookmarkItems.push(objectToUpdate)
                } else {
                    state.bookmarkItems.splice(bookmarkIndex, 1)
                }

                state.loading = true
                state.actionFlag = action.payload.actionFlag
                state.success = action.payload.success
                state.error = action.payload.error
            })
    }
})

export const {
    handleSearchQuery,
    clearNavBookmarksMessage
} = navBookmarkSlice.actions

export default navBookmarkSlice.reducer

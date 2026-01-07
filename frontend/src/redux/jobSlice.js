import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        isLoadingJobs: false,
        filters:{
            location:"",
            category:"",
            salary:""
        },
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            // Clear jobs immediately when search query changes to prevent showing old results
            if (state.searchedQuery !== action.payload) {
                state.allJobs = [];
            }
            state.searchedQuery = action.payload;
        },
        setIsLoadingJobs:(state,action) => {
            state.isLoadingJobs = action.payload;
        },
        setFilters:(state,action) => {
            // Ensure filters object exists before merging
            if (!state.filters) {
                state.filters = {
                    location: "",
                    category: "",
                    salary: ""
                };
            }
            // Only update if value actually changed to prevent unnecessary re-renders
            const updates = {};
            Object.keys(action.payload).forEach(key => {
                if (state.filters[key] !== action.payload[key]) {
                    updates[key] = action.payload[key];
                }
            });
            if (Object.keys(updates).length > 0) {
                state.filters = {...state.filters, ...updates};
            }
        },
        clearFilters:(state) => {
            state.filters = {
                location:"",
                category:"",
                salary:""
            };
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setIsLoadingJobs,
    setFilters,
    clearFilters
} = jobSlice.actions;
export default jobSlice.reducer;
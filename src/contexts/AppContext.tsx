import React, { createContext, useContext, useReducer, ReactNode } from "react";

/**
 * Define the state shape for the AppContext.
 * Expand this as needed for global application state.
 */
interface AppState {
  isSidebarOpen: boolean;
  userCount: number;
  // Add other global state properties here (e.g., authUser, activeDeviceId)
}

/**
 * Define the available actions for the AppContext.
 */
type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_USER_COUNT"; payload: number };

/**
 * Initial state for the AppContext.
 */
const initialState: AppState = {
  isSidebarOpen: true,
  userCount: 0,
};

/**
 * Reducer function to handle state transitions.
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case "SET_USER_COUNT":
      return { ...state, userCount: action.payload };
    default:
      return state;
  }
}

/**
 * Create the Context with a default value of undefined.
 * This ensures it must be used within an AppProvider.
 */
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

/**
 * AppProvider component that wraps the application.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook for consuming the AppContext.
 * Throws an error if used outside of an AppProvider.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

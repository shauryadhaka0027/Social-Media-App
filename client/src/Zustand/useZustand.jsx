import { create } from 'zustand'

export const useZustand = create((set) => ({
    // valid:false,
    // setValid: (valid) => set({ valid }),
     
    userInformation:{},
    setUserInformation:(userInformation)=>set({userInformation}),

}));

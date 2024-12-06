import { notification } from 'antd';
import { create } from 'zustand'

export const useZustand = create((set) => ({
    // valid:false,
    // setValid: (valid) => set({ valid }),
     
    userInformation:{},
    setUserInformation:(userInformation)=>set({userInformation}),

    notification:[],
    setNotification:(notification)=>set({notification}),

    countNotification:0,
    setCountNotification:(countNotification)=>set({countNotification}),

    


}));

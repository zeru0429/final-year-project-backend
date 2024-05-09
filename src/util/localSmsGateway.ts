
import axios from "axios";
import { SMS_ENDPOINT, SMS_TOKEN } from "../config/secrets.js";


export const sendSMS =async (to: string,message:string)=>{

    const formData ={
        to: to,
        message: message
    }
  
    console.log(formData);
    
    try {
        const response = await axios.post(`${SMS_ENDPOINT}`, formData, {
          headers: {
            'Authorization': `${SMS_TOKEN}`
          }
        });
       console.log(response.data);
    
        if (response.status === 200) {
          return {
            success: true,
            message: 'SMS sent successfully',
          };
        } else {
            return {
                success: false,
                message: 'SMS not sent',
              };
         
        }
      } catch (error: any) {
        console.log(error.message);
        return {
            success: false,
            message:  error,
          };
      }
    
}
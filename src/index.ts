import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";


import { Identify } from "./Interfaces/index";

import { myDataSource } from "./db/index";
const Contact  =require("./entity/identify.model");

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;


myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


app.use(express.json());


app.post('/identify', async (req: Request, res: Response) => {
    // const payload: Identify= req.body;
  
    const { email, phoneNumber }:Identify = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }
  
    try {
      let existingContact =  await myDataSource.getRepository(Contact).findOne({ where: [{ email }, { phoneNumber }] });

      if(existingContact?.email==email && existingContact?.phoneNumber==phoneNumber)
      return res.status(200).json({
        contact: {
          primaryContatctId: existingContact?.linkedId || existingContact?.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        }
      });
    

      if (existingContact) {
        // Check if it's a primary contact or secondary contact
        if (existingContact.linkPrecedence === 'primary') {
          

          // const primaryContactWithSameEmail = await myDataSource.getRepository(Contact).findOne({ where: { email, linkPrecedence: 'primary' } });
          // const primaryContactWithSamePhoneNumber = await myDataSource.getRepository(Contact).findOne({ where: { phoneNumber, linkPrecedence: 'primary' } });

          const primaryContactWithSameEmail = await myDataSource.getRepository(Contact).findOne({ where: { email, } });
          const primaryContactWithSamePhoneNumber = await myDataSource.getRepository(Contact).findOne({ where: { phoneNumber,  } });

          if (primaryContactWithSameEmail?.linkPrecedence=="primary" && primaryContactWithSamePhoneNumber?.linkPrecedence=="primary") {
          // Create a new secondary contact
          
          const obj = {
            // email: email ,
            // phoneNumber: phoneNumber ,
          
            linkPrecedence:'secondary',
            linkedId:existingContact.id,
            updatedAt: new Date(),
       
          };
          let id;
          if(primaryContactWithSameEmail.id!=existingContact.id)
          id=primaryContactWithSameEmail.id
          else
         id=primaryContactWithSamePhoneNumber.id
        
          // const contact =  myDataSource.getRepository(Contact).create(obj)
          await myDataSource.getRepository(Contact).update({id},obj)



          const emails = [existingContact.email, primaryContactWithSameEmail?.email,primaryContactWithSamePhoneNumber?.email].filter(Boolean);
          const phoneNumbers = [existingContact.phoneNumber, primaryContactWithSameEmail?.phoneNumber, primaryContactWithSamePhoneNumber?.phoneNumber].filter(Boolean);
         
          // Return consolidated contact information
          return res.status(200).json({
            contact: {
              primaryContatctId: existingContact.id,
              emails: [...new Set(emails)],
              phoneNumbers: [...new Set(phoneNumbers)],
              secondaryContactIds: [id],
            }
          });
        }
        else if(primaryContactWithSameEmail?.linkPrecedence=='secondary' || primaryContactWithSamePhoneNumber?.linkPrecedence=='secondary'){
          let secondaryPhone,secondaryEmail,id;
          if(primaryContactWithSameEmail){
           
             secondaryPhone = await myDataSource.getRepository(Contact).findOne({ where: { phoneNumber, linkPrecedence: 'secondary' } });
             id=secondaryPhone?.id
          }
          if(primaryContactWithSamePhoneNumber){
             secondaryEmail = await myDataSource.getRepository(Contact).findOne({ where: { email, linkPrecedence: 'secondary' } });
             id=secondaryEmail?.id
          }

          const emails = [existingContact.email, secondaryPhone?.email,secondaryEmail?.email].filter(Boolean);
          const phoneNumbers = [existingContact.phoneNumber, secondaryPhone?.phoneNumber, secondaryEmail?.phoneNumber].filter(Boolean);
          
          
          
          return res.status(200).json({
            contact: {
              primaryContatctId: existingContact.id,
              emails: [...new Set(emails)],
              phoneNumbers: [...new Set(phoneNumbers)],
              secondaryContactIds: [id],
            }
          });
        }   
        else {
          const newSecondaryContact = {
            email: email ,
            phoneNumber: phoneNumber ,
            linkedId:existingContact.linkedId,
            linkPrecedence:'secondary',
            createdAt: new Date(),
           
       
          };
        
          const contact =  myDataSource.getRepository(Contact).create(newSecondaryContact)
          await myDataSource.getRepository(Contact).save(contact)
  
  
          const emails = [newSecondaryContact.email,existingContact.email].filter(Boolean);
          const phoneNumbers = [newSecondaryContact.phoneNumber,existingContact.phoneNumber].filter(Boolean);
          // Return consolidated contact information
          return res.status(200).json({
            contact: {
              primaryContatctId: existingContact.id,
              emails: [...new Set(emails)],
              phoneNumbers: [...new Set(phoneNumbers)],
              secondaryContactIds: [existingContact.id,contact.id],
            }
          })
          
   
        }
      } else {
       


        const newPrimaryContact = {
          email: email ,
          phoneNumber: phoneNumber ,
          linkedId:existingContact.linkedId,
          linkPrecedence:'secondary',
          createdAt: new Date(),
          updatedAt: new Date(),
     
        };
      
        const contact =  myDataSource.getRepository(Contact).create(newPrimaryContact)
        await myDataSource.getRepository(Contact).save(contact)


        const emails = [newPrimaryContact.email].filter(Boolean);
        const phoneNumbers = [newPrimaryContact.phoneNumber].filter(Boolean);
        // Return consolidated contact information
        return res.status(200).json({
          contact: {
            primaryContatctId: existingContact.linkedId,
            emails: [...new Set(emails)],
            phoneNumbers: [...new Set(phoneNumbers)],
            secondaryContactIds: [existingContact.id,contact.id],
          }
        });
      }






    } 
  
    const newPrimaryContact = {
      email: email ,
      phoneNumber: phoneNumber ,
      linkedId:null,
      linkPrecedence:'primary',
      createdAt: new Date(),
    
 
    };
  
    const contact =  myDataSource.getRepository(Contact).create(newPrimaryContact)
    await myDataSource.getRepository(Contact).save(contact)


   
    return res.status(200).json({
      contact: {
        primaryContatctId: contact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: [],
      }
    });
  
  
  
  
  
  }catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  
   
  });
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });
  
  app.listen(port, () => {
    console.log('Server is running on port 3000');
  });
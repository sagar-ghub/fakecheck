interface Identify {
    email?: string;
    phoneNumber?: string;
  }
  
  interface ContactInterface {
    // id: number;
    phoneNumber: string | null;
    email: string | null;
    linkedId: number | null;
    linkPrecedence: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }
  

  export { Identify, ContactInterface };
interface TokenInterface {
  userId: string;
}

type RequestedFiles = {[fieldname: string]: Express.Multer.File[]};



export {
    TokenInterface,
    RequestedFiles
}
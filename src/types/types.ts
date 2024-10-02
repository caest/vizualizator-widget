// Типы для каждого объекта

export interface Language {
    id: string;
    name: string;
  }
  
  export interface Color {
    key: string;
    name: string;
    code: string;
    language: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    language: string;
  }
  
  export interface House {
    id: string;
    name: string;
    language: string;
  }
  
// types/types.ts
export interface Widget {
  key: string;
  name: string;
  header: string;
  description: string;
  colors: Color[];
  brands: Brand[];
  houses: House[];
  emails: string[];
  language: string;
  downloadButton: string;
  resetButton: string;
  submitButton: string;
  sendButton: string;
  messageCantDownoloadWgd: string;
  messageError: string;
  messageCantDownoloadImg: string;
  messageChooseAllParams: string;
  cannotFindImg: string;
  success: string;
  sendedForm: string;
  fieldName: string;
  fieldNameRule: string;
  fieldPhoneNumber: string;
  fieldPhoneNumberRule:string;
  fieldPhoneNumberValidation:string;
  fieldEmailRule: string;
  fieldEmailValidation: string;
}
